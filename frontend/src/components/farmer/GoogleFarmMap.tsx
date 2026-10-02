import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Maximize2, ExternalLink, Crosshair } from 'lucide-react';

export interface FieldItem {
  id: string;
  name: string;
  crop: string;
  area?: string;
  acres?: string;
  soil_type?: string;
  soil?: string;
  irrigation_type?: string;
  method?: string;
  latitude: number;
  longitude: number;
  soil_moisture_pct?: number;
  water_needed_today_mm?: number;
  status?: string;
}

interface GoogleFarmMapProps {
  fields: FieldItem[];
  selectedField: string;
  onSelectField: (fieldName: string) => void;
  mapViewMode: 'all' | 'selected';
  onToggleViewMode: (mode: 'all' | 'selected') => void;
  mapLayer: 's' | 'y'; // 's' = Satellite, 'y' = Hybrid (Satellite + Roads/Labels)
  onToggleLayer?: (layer: 's' | 'y') => void;
  onAutoDetectGps?: () => Promise<void>;
  isDetectingGps?: boolean;
  onExpand?: () => void;
  heightClass?: string;
  showQuickPills?: boolean;
  showExpandButton?: boolean;
}

// Generate realistic farm parcel polygon coordinates around field center
function getFieldPolygon(lat: number, lng: number, index: number): [number, number][] {
  const dLat = 0.00065;
  const dLng = 0.00085;
  if (index === 0) {
    return [
      [lat - dLat, lng - dLng],
      [lat - dLat * 0.9, lng + dLng],
      [lat + dLat, lng + dLng * 0.85],
      [lat + dLat * 0.95, lng - dLng * 0.9],
    ];
  } else if (index === 1) {
    return [
      [lat - dLat * 0.75, lng - dLng * 0.8],
      [lat - dLat * 0.65, lng + dLng * 0.75],
      [lat + dLat * 0.8, lng + dLng * 0.7],
      [lat + dLat * 0.7, lng - dLng * 0.75],
    ];
  } else {
    return [
      [lat - dLat * 1.1, lng - dLng * 1.05],
      [lat - dLat * 0.95, lng + dLng * 1.1],
      [lat + dLat * 1.05, lng + dLng * 1.0],
      [lat + dLat * 1.0, lng - dLng * 1.05],
    ];
  }
}

// Field styles based on index & selection
const FIELD_COLORS = [
  { fill: '#10b981', stroke: '#059669', name: 'Emerald / Rice', cropIcon: '🌾' },
  { fill: '#f43f5e', stroke: '#e11d48', name: 'Rose / Tomato', cropIcon: '🍅' },
  { fill: '#f59e0b', stroke: '#d97706', name: 'Amber / Wheat', cropIcon: '🌿' },
];

export const GoogleFarmMap: React.FC<GoogleFarmMapProps> = ({
  fields,
  selectedField,
  onSelectField,
  mapViewMode,
  onToggleViewMode,
  mapLayer,
  onAutoDetectGps,
  isDetectingGps = false,
  onExpand,
  heightClass = 'h-32 sm:h-36',
  showQuickPills = true,
  showExpandButton = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsRef = useRef<L.Polygon[]>([]);
  const markersRef = useRef<L.Marker[]>([]);

  const currentField = fields.find((f) => f.name === selectedField) || fields[0];
  const activeLat = currentField?.latitude || 26.7271;
  const activeLng = currentField?.longitude || 88.3953;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter: [number, number] = [activeLat, activeLng];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
    });

    // Add Leaflet zoom control at bottom-right
    L.control
      .zoom({
        position: 'bottomright',
      })
      .addTo(map);

    // Google Satellite Tile Layer
    const tileUrl = `https://mt{s}.google.com/vt/lyrs=${mapLayer}&x={x}&y={y}&z={z}`;
    const tileLayer = L.tileLayer(tileUrl, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 21,
      maxNativeZoom: 20,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Invalidate size after initial render to avoid grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when mapLayer ('s' or 'y') changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tileUrl = `https://mt{s}.google.com/vt/lyrs=${mapLayer}&x={x}&y={y}&z={z}`;
    const newLayer = L.tileLayer(tileUrl, {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 21,
      maxNativeZoom: 20,
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapLayer]);

  // Render Polygons & Markers for all fields
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear previous polygons & markers
    polygonsRef.current.forEach((p) => p.remove());
    polygonsRef.current = [];
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    fields.forEach((field, index) => {
      const colorScheme = FIELD_COLORS[index % FIELD_COLORS.length];
      const isSelected = field.name === selectedField;
      const polyCoords = getFieldPolygon(field.latitude, field.longitude, index);

      polyCoords.forEach(([lat, lng]) => bounds.extend([lat, lng]));

      // Farm Parcel Polygon on Google Satellite
      const polygon = L.polygon(polyCoords, {
        color: isSelected ? '#ffffff' : colorScheme.stroke,
        weight: isSelected ? 3 : 2,
        fillColor: colorScheme.fill,
        fillOpacity: isSelected ? 0.45 : 0.28,
        dashArray: isSelected ? undefined : '4, 4',
      }).addTo(map);

      polygon.on('click', () => {
        onSelectField(field.name);
        onToggleViewMode('selected');
      });

      polygon.bindTooltip(
        `<b>${field.name}</b><br/>Crop: ${field.crop}<br/>Area: ${field.area || field.acres || '2.5 Acres'}<br/>Moisture: ${field.soil_moisture_pct || 32}%`,
        {
          direction: 'top',
          className: 'farm-map-tooltip',
          permanent: false,
        }
      );

      polygonsRef.current.push(polygon);

      // Custom HTML Marker Pill
      const fieldShortName = field.name.includes('Field 1')
        ? 'F1: Rice'
        : field.name.includes('Field 2')
        ? 'F2: Tomato'
        : field.name.includes('Field 3')
        ? 'F3: Wheat'
        : field.name;

      const markerHtml = `
        <div class="cursor-pointer group transform transition-transform duration-200 hover:scale-110 -translate-x-1/2 -translate-y-1/2">
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-full shadow-lg border text-[9px] font-bold ${
            isSelected
              ? 'bg-[#008037] text-white border-white ring-2 ring-emerald-300 ring-offset-1'
              : 'bg-black/80 text-white border-white/40 hover:bg-black/95'
          }">
            <span>${colorScheme.cropIcon}</span>
            <span class="whitespace-nowrap">${fieldShortName}</span>
          </div>
          <div class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-white'} mx-auto mt-0.5 shadow-sm"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-field-pin',
        iconSize: [80, 28],
        iconAnchor: [40, 14],
      });

      const marker = L.marker([field.latitude, field.longitude], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        onSelectField(field.name);
        onToggleViewMode('selected');
      });

      markersRef.current.push(marker);
    });

    // View Mode Adjustments (All Fields vs Selected Field)
    if (mapViewMode === 'all' && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [25, 25], maxZoom: 17, animate: true });
    } else if (currentField) {
      map.setView([currentField.latitude, currentField.longitude], 17, { animate: true });
    }
  }, [fields, selectedField, mapViewMode]);

  const externalGoogleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${activeLat},${activeLng}`;

  return (
    <div className={`relative rounded-xl overflow-hidden border border-gray-200 ${heightClass} bg-[#0b1e13] shadow-xs group`}>
      <style>{`
        .farm-map-tooltip {
          background: rgba(15, 23, 42, 0.92) !important;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
          border-radius: 8px !important;
          font-size: 11px !important;
          padding: 6px 10px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
        }
        .farm-map-tooltip::before {
          border-top-color: rgba(15, 23, 42, 0.92) !important;
        }
        .custom-field-pin {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        .leaflet-control-zoom-in, .leaflet-control-zoom-out {
          background-color: rgba(255, 255, 255, 0.92) !important;
          color: #1f2937 !important;
          width: 22px !important;
          height: 22px !important;
          line-height: 22px !important;
          font-size: 13px !important;
        }
      `}</style>

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top-Left GPS Auto-Detect Pin Tag */}
      <div className="absolute top-1.5 left-1.5 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/20 flex items-center gap-1 text-[9px] text-white font-medium z-10 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        <span>
          GPS: {activeLat.toFixed(4)}°, {activeLng.toFixed(4)}°
        </span>
      </div>

      {/* Top-Right Expand & Direct Google Maps link */}
      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10">
        <a
          href={externalGoogleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="w-6 h-6 rounded-md bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
          title="Open in Google Maps App"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
        {showExpandButton && onExpand && (
          <button
            onClick={onExpand}
            className="w-6 h-6 rounded-md bg-white/90 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs cursor-pointer transition-colors"
            title="Maximize Field Satellite View"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Bottom Quick-Switch Field Pills Floating on Map */}
      {showQuickPills && (
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between gap-1 overflow-x-auto py-0.5 z-10">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md p-0.5 rounded-lg border border-white/20 shadow-md">
            <button
              onClick={() => onToggleViewMode('all')}
              className={`px-1.5 py-0.5 rounded text-[8px] font-bold cursor-pointer transition-colors ${
                mapViewMode === 'all' ? 'bg-[#008037] text-white shadow-xs' : 'text-gray-200 hover:text-white'
              }`}
            >
              🌐 All Fields
            </button>
            {fields.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onSelectField(f.name);
                  onToggleViewMode('selected');
                }}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold cursor-pointer transition-colors ${
                  selectedField === f.name && mapViewMode === 'selected'
                    ? 'bg-[#0284c7] text-white shadow-xs'
                    : 'text-gray-200 hover:text-white'
                }`}
              >
                {f.crop} ({f.area || f.acres})
              </button>
            ))}
          </div>

          {onAutoDetectGps && (
            <button
              onClick={onAutoDetectGps}
              className={`bg-white/90 hover:bg-white text-gray-900 px-1.5 py-0.5 rounded-md text-[8px] font-bold flex items-center gap-0.5 shadow-xs cursor-pointer transition-all ${
                isDetectingGps ? 'animate-pulse text-emerald-700' : ''
              }`}
              title="Auto-detect current GPS coordinates"
            >
              <Crosshair className="w-2.5 h-2.5 text-emerald-700" />
              <span>Auto GPS</span>
            </button>
          )}
        </div>
      )}

      {/* Google Attribution Watermark */}
      <div className="absolute bottom-0 right-1 text-[7px] text-white/60 pointer-events-none z-10">
        Google Satellite
      </div>
    </div>
  );
};
