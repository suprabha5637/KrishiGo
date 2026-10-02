import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface DeviceLocation {
  city: string;
  state: string;
  district?: string;
  country: string;
  postal_code?: string;
  formatted_address: string;
  display_name: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  isAutoDetected: boolean;
  provider: string;
}

const DEFAULT_LOCATION: DeviceLocation = {
  city: 'Siliguri',
  state: 'West Bengal',
  district: 'Darjeeling',
  country: 'India',
  postal_code: '734001',
  formatted_address: 'Siliguri, West Bengal, India',
  display_name: 'Siliguri, West Bengal',
  latitude: 26.7271,
  longitude: 88.3953,
  isAutoDetected: false,
  provider: 'default_preset',
};

interface LocationContextType {
  location: DeviceLocation;
  isDetecting: boolean;
  isModalOpen: boolean;
  error: string | null;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  detectDeviceLocation: () => Promise<void>;
  searchAndMarkLocation: (query: string) => Promise<void>;
  setManualCoordinates: (lat: number, lng: number) => Promise<void>;
  setManualLocation: (loc: string) => void;
  supportedPresets: string[];
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<DeviceLocation>(() => {
    try {
      const saved = localStorage.getItem('krishigo_device_location');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_LOCATION;
  });

  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const openLocationModal = useCallback(() => setIsModalOpen(true), []);
  const closeLocationModal = useCallback(() => setIsModalOpen(false), []);

  const supportedPresets = [
    'Siliguri, West Bengal',
    'Kolkata, West Bengal',
    'Patna, Bihar',
    'Burdwan, West Bengal',
    'Darjeeling, West Bengal',
    'Malda, West Bengal',
    'Jalpaiguri, West Bengal',
  ];

  const PRESET_COORDS: Record<string, { lat: number; lng: number; district?: string }> = {
    'Siliguri, West Bengal': { lat: 26.7271, lng: 88.3953, district: 'Darjeeling' },
    'Kolkata, West Bengal': { lat: 22.5726, lng: 88.3639, district: 'Kolkata' },
    'Patna, Bihar': { lat: 25.5941, lng: 85.1376, district: 'Patna' },
    'Burdwan, West Bengal': { lat: 23.2324, lng: 87.8615, district: 'Purba Bardhaman' },
    'Darjeeling, West Bengal': { lat: 27.0410, lng: 88.2663, district: 'Darjeeling' },
    'Malda, West Bengal': { lat: 25.0108, lng: 88.1411, district: 'Malda' },
    'Jalpaiguri, West Bengal': { lat: 26.5414, lng: 88.7196, district: 'Jalpaiguri' },
  };

  // Helper fetcher supporting Vite proxy and direct backend fallback
  const fetchLocationApi = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const res = await fetch(endpoint, options);
      if (res.ok) return res;
    } catch {
      // fallback to direct backend url
    }
    return fetch(`http://127.0.0.1:8000${endpoint}`, options);
  };

  // Core reverse-geocode function via Google Maps API proxy
  const reverseGeocodeCoordinates = async (lat: number, lng: number, accuracy?: number) => {
    try {
      const response = await fetchLocationApi('/api/v1/location/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      if (!response.ok) {
        throw new Error(`Reverse geocode failed with HTTP ${response.status}`);
      }

      const data = await response.json();
      const detected: DeviceLocation = {
        city: data.city || 'Current Location',
        state: data.state || '',
        district: data.district,
        country: data.country || 'India',
        postal_code: data.postal_code,
        formatted_address: data.formatted_address || data.display_name,
        display_name: data.display_name || `${data.city}, ${data.state}`,
        latitude: lat,
        longitude: lng,
        accuracy: accuracy,
        isAutoDetected: true,
        provider: data.provider || 'google_maps_geocoding',
      };

      setLocation(detected);
      localStorage.setItem('krishigo_device_location', JSON.stringify(detected));
      setError(null);
    } catch (err: any) {
      console.warn('Google reverse geocode error:', err);
      // Still store coordinates even if reverse geocoding had issues
      const fallback: DeviceLocation = {
        ...DEFAULT_LOCATION,
        latitude: lat,
        longitude: lng,
        accuracy,
        isAutoDetected: true,
      };
      setLocation(fallback);
    }
  };

  // Option 1: Automatically fetch device location using HTML5 Geolocation + Google Geocoding API
  const detectDeviceLocation = useCallback(async () => {
    setIsDetecting(true);
    setError(null);

    let networkCompleted = false;
    // 1. Fast-path: immediately fetch network/IP detected location from backend
    try {
      const res = await fetchLocationApi('/api/v1/location/detect');
      if (res.ok) {
        const data = await res.json();
        if (data.latitude && data.longitude) {
          const netDetected: DeviceLocation = {
            city: data.city || 'Current Location',
            state: data.state || 'West Bengal',
            district: data.district,
            country: data.country || 'India',
            postal_code: data.postal_code,
            formatted_address: data.formatted_address || data.display_name,
            display_name: data.display_name || `${data.city}, ${data.state}`,
            latitude: data.latitude,
            longitude: data.longitude,
            accuracy: data.accuracy,
            isAutoDetected: true,
            provider: data.provider || 'ip_network_geolocate',
          };
          setLocation(netDetected);
          localStorage.setItem('krishigo_device_location', JSON.stringify(netDetected));
          networkCompleted = true;
        }
      }
    } catch (e) {
      console.warn('Network auto-detect error:', e);
    }

    // 2. High-Accuracy HTML5 Geolocation API (Device GPS / Mobile Antenna)
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          await reverseGeocodeCoordinates(lat, lng, accuracy);
          setIsDetecting(false);
        },
        (geoError) => {
          console.info('Browser GPS fallback info:', geoError.message);
          setIsDetecting(false);
          if (!networkCompleted) {
            setError('Could not auto-detect location. Defaulting to current area.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 6000,
          maximumAge: 15000,
        }
      );
    } else {
      setIsDetecting(false);
    }
  }, []);

  // Option 2: Enter manually and mark on Google Map
  const searchAndMarkLocation = async (query: string) => {
    try {
      const res = await fetchLocationApi('/api/v1/location/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        throw new Error(`Geocode failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      const marked: DeviceLocation = {
        city: data.city || query,
        state: data.state || 'West Bengal',
        district: data.district,
        country: data.country || 'India',
        postal_code: data.postal_code,
        formatted_address: data.formatted_address || `${query}, West Bengal, India`,
        display_name: data.display_name || query,
        latitude: data.latitude,
        longitude: data.longitude,
        isAutoDetected: false,
        provider: data.provider || 'manual_search_google_map',
      };

      setLocation(marked);
      localStorage.setItem('krishigo_device_location', JSON.stringify(marked));
      setError(null);
    } catch (err: any) {
      console.error('Failed to search & mark location:', err);
      throw err;
    }
  };

  // Option 2 (Sub-case): Enter coordinates manually and mark on Google Map
  const setManualCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetchLocationApi('/api/v1/location/reverse-geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: lat, longitude: lng }),
      });

      if (response.ok) {
        const data = await response.json();
        const pinned: DeviceLocation = {
          city: data.city || 'Custom Pin Location',
          state: data.state || '',
          district: data.district,
          country: data.country || 'India',
          postal_code: data.postal_code,
          formatted_address: data.formatted_address,
          display_name: data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          latitude: lat,
          longitude: lng,
          isAutoDetected: false,
          provider: 'manual_coordinates_pin',
        };
        setLocation(pinned);
        localStorage.setItem('krishigo_device_location', JSON.stringify(pinned));
      } else {
        const fallback: DeviceLocation = {
          ...DEFAULT_LOCATION,
          latitude: lat,
          longitude: lng,
          display_name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
          formatted_address: `Coordinates: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
          isAutoDetected: false,
          provider: 'manual_coordinates_pin',
        };
        setLocation(fallback);
        localStorage.setItem('krishigo_device_location', JSON.stringify(fallback));
      }
    } catch (e) {
      console.warn('Manual pin error:', e);
    }
  };

  // Set location manually from preset (backward compatibility + sync coordinates)
  const setManualLocation = (locName: string) => {
    const parts = locName.split(',').map((s) => s.trim());
    const city = parts[0] || locName;
    const state = parts[1] || 'West Bengal';
    const coords = PRESET_COORDS[locName] || { lat: location.latitude, lng: location.longitude };

    const updated: DeviceLocation = {
      ...location,
      city,
      state,
      district: PRESET_COORDS[locName]?.district || location.district,
      display_name: locName,
      latitude: coords.lat,
      longitude: coords.lng,
      isAutoDetected: false,
      provider: 'manual_preset',
    };

    setLocation(updated);
    localStorage.setItem('krishigo_device_location', JSON.stringify(updated));
  };

  // Auto-detect on first visit or if current is default fallback
  useEffect(() => {
    try {
      const saved = localStorage.getItem('krishigo_device_location');
      if (!saved) {
        detectDeviceLocation();
      } else {
        const parsed = JSON.parse(saved);
        if (!parsed.isAutoDetected || (parsed.latitude === 26.7271 && parsed.longitude === 88.3953)) {
          detectDeviceLocation();
        }
      }
    } catch {
      detectDeviceLocation();
    }
  }, [detectDeviceLocation]);

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        isModalOpen,
        error,
        openLocationModal,
        closeLocationModal,
        detectDeviceLocation,
        searchAndMarkLocation,
        setManualCoordinates,
        setManualLocation,
        supportedPresets,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useDeviceLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useDeviceLocation must be used within a LocationProvider');
  }
  return context;
};
