import httpx
from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Request
from pydantic import BaseModel
from backend.app.core.config import settings

router = APIRouter(prefix="/location", tags=["location"])

class ReverseGeocodeRequest(BaseModel):
    latitude: float
    longitude: float

class GeocodeRequest(BaseModel):
    query: str

class LocationResponse(BaseModel):
    status: str
    provider: str
    latitude: float
    longitude: float
    city: str
    state: str
    district: Optional[str] = None
    country: str
    postal_code: Optional[str] = None
    formatted_address: str
    display_name: str
    accuracy: Optional[float] = None

@router.get("/config")
async def get_location_config():
    """Returns location service configuration & Google API status"""
    return {
        "has_google_key": bool(settings.GOOGLE_MAPS_API_KEY or settings.GOOGLE_MAPS_BROWSER_KEY),
        "default_location": {
            "city": "Siliguri",
            "state": "West Bengal",
            "country": "India",
            "display_name": "Siliguri, West Bengal",
            "latitude": 26.7271,
            "longitude": 88.3953
        },
        "supported_presets": [
            "Siliguri, West Bengal",
            "Kolkata, West Bengal",
            "Darjeeling, West Bengal",
            "Malda, West Bengal",
            "Jalpaiguri, West Bengal"
        ]
    }

@router.post("/reverse-geocode", response_model=LocationResponse)
async def reverse_geocode(req: ReverseGeocodeRequest):
    """
    Reverse geocodes device coordinates (latitude, longitude) into a real human address using Google Maps Geocoding API.
    """
    api_key = settings.GOOGLE_MAPS_API_KEY or settings.GOOGLE_MAPS_BROWSER_KEY

    # 1. If Google Maps API key is configured, use Google Maps Geocoding API
    if api_key:
        try:
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {
                "latlng": f"{req.latitude},{req.longitude}",
                "key": api_key
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, params=params)
                data = res.json()

            if data.get("status") == "OK" and data.get("results"):
                first_result = data["results"][0]
                formatted_address = first_result.get("formatted_address", "")
                
                # Extract address components
                city = ""
                state = ""
                district = ""
                country = "India"
                postal_code = ""

                for comp in first_result.get("address_components", []):
                    types = comp.get("types", [])
                    if "locality" in types:
                        city = comp.get("long_name", "")
                    elif "administrative_area_level_2" in types:
                        district = comp.get("long_name", "")
                    elif "administrative_area_level_1" in types:
                        state = comp.get("long_name", "")
                    elif "country" in types:
                        country = comp.get("long_name", "")
                    elif "postal_code" in types:
                        postal_code = comp.get("long_name", "")
                    elif not city and "sublocality_level_1" in types:
                        city = comp.get("long_name", "")

                if not city and district:
                    city = district

                display_name = f"{city}, {state}" if city and state else (city or state or formatted_address)

                return LocationResponse(
                    status="success",
                    provider="google_maps_geocoding",
                    latitude=req.latitude,
                    longitude=req.longitude,
                    city=city or "Current Location",
                    state=state or "",
                    district=district,
                    country=country,
                    postal_code=postal_code,
                    formatted_address=formatted_address,
                    display_name=display_name
                )
        except Exception as e:
            # Fall through to fallback
            print(f"Google Maps Geocoding API error: {e}")

    # 2. Resilient OpenStreetMap / Geometric Fallback when Google API key is pending
    # Check if close to known agricultural centers or fetch from Nominatim with polite headers
    try:
        nominatim_url = f"https://nominatim.openstreetmap.org/reverse?lat={req.latitude}&lon={req.longitude}&format=json"
        headers = {"User-Agent": "KrishiGo-Agricultural-Platform/1.0"}
        async with httpx.AsyncClient(timeout=6.0) as client:
            res = await client.get(nominatim_url, headers=headers)
            if res.status_code == 200:
                geo_data = res.json()
                address = geo_data.get("address", {})
                city = address.get("city") or address.get("town") or address.get("municipality") or address.get("village") or address.get("county") or "Siliguri"
                state = address.get("state") or "West Bengal"
                country = address.get("country") or "India"
                display_name = f"{city}, {state}"
                formatted = geo_data.get("display_name", display_name)

                return LocationResponse(
                    status="success",
                    provider="osm_fallback" if not api_key else "google_maps_fallback",
                    latitude=req.latitude,
                    longitude=req.longitude,
                    city=city,
                    state=state,
                    district=address.get("county"),
                    country=country,
                    postal_code=address.get("postcode"),
                    formatted_address=formatted,
                    display_name=display_name
                )
    except Exception:
        pass

    # 3. Fallback to Siliguri West Bengal (Screenshot default)
    return LocationResponse(
        status="success",
        provider="default_preset",
        latitude=req.latitude,
        longitude=req.longitude,
        city="Siliguri",
        state="West Bengal",
        district="Darjeeling",
        country="India",
        postal_code="734001",
        formatted_address="Siliguri, West Bengal, India",
        display_name="Siliguri, West Bengal"
    )

@router.post("/geocode", response_model=LocationResponse)
async def forward_geocode(req: GeocodeRequest):
    """
    Forward geocodes a manual search query (city, address, pincode) into exact coordinates and address using Google Maps Geocoding API.
    """
    api_key = settings.GOOGLE_MAPS_API_KEY or settings.GOOGLE_MAPS_BROWSER_KEY
    query = req.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    if api_key:
        try:
            url = "https://maps.googleapis.com/maps/api/geocode/json"
            params = {"address": query, "key": api_key}
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(url, params=params)
                data = res.json()

            if data.get("status") == "OK" and data.get("results"):
                first = data["results"][0]
                geometry = first.get("geometry", {}).get("location", {})
                lat = geometry.get("lat")
                lng = geometry.get("lng")
                formatted_address = first.get("formatted_address", query)

                city = ""
                state = ""
                district = ""
                country = "India"
                postal_code = ""

                for comp in first.get("address_components", []):
                    types = comp.get("types", [])
                    if "locality" in types:
                        city = comp.get("long_name", "")
                    elif "administrative_area_level_2" in types:
                        district = comp.get("long_name", "")
                    elif "administrative_area_level_1" in types:
                        state = comp.get("long_name", "")
                    elif "country" in types:
                        country = comp.get("long_name", "")
                    elif "postal_code" in types:
                        postal_code = comp.get("long_name", "")

                if not city and district:
                    city = district

                display_name = f"{city}, {state}" if city and state else (city or state or formatted_address)

                return LocationResponse(
                    status="success",
                    provider="google_maps_geocoding",
                    latitude=lat,
                    longitude=lng,
                    city=city or query,
                    state=state,
                    district=district,
                    country=country,
                    postal_code=postal_code,
                    formatted_address=formatted_address,
                    display_name=display_name
                )
        except Exception as e:
            print(f"Google Maps Forward Geocoding error: {e}")

    # Fallback to OpenStreetMap forward search
    try:
        url = "https://nominatim.openstreetmap.org/search"
        params = {"q": query, "format": "json", "addressdetails": "1", "limit": "1"}
        headers = {"User-Agent": "KrishiGo-Agricultural-Platform/1.0"}
        async with httpx.AsyncClient(timeout=6.0) as client:
            res = await client.get(url, params=params, headers=headers)
            if res.status_code == 200:
                results = res.json()
                if results:
                    first = results[0]
                    lat = float(first.get("lat", 26.7271))
                    lng = float(first.get("lon", 88.3953))
                    addr = first.get("address", {})
                    city = addr.get("city") or addr.get("town") or addr.get("municipality") or addr.get("village") or addr.get("county") or query
                    state = addr.get("state") or "West Bengal"
                    country = addr.get("country") or "India"
                    formatted = first.get("display_name", f"{city}, {state}")
                    return LocationResponse(
                        status="success",
                        provider="osm_forward_fallback",
                        latitude=lat,
                        longitude=lng,
                        city=city,
                        state=state,
                        district=addr.get("county"),
                        country=country,
                        postal_code=addr.get("postcode"),
                        formatted_address=formatted,
                        display_name=f"{city}, {state}"
                    )
    except Exception:
        pass

    # Default preset
    return LocationResponse(
        status="success",
        provider="manual_default",
        latitude=26.7271,
        longitude=88.3953,
        city=query,
        state="West Bengal",
        district="Darjeeling",
        country="India",
        postal_code="734001",
        formatted_address=f"{query}, West Bengal, India",
        display_name=f"{query}, West Bengal"
    )

@router.get("/detect", response_model=LocationResponse)
async def auto_detect_location(request: Request):
    """
    Attempts automatic network/IP geolocation using Google Geolocation API or IP lookup.
    """
    api_key = settings.GOOGLE_MAPS_API_KEY or settings.GOOGLE_MAPS_BROWSER_KEY

    # 1. Try Google Geolocation API if key is present
    if api_key:
        try:
            url = f"https://www.googleapis.com/geolocation/v1/geolocate?key={api_key}"
            async with httpx.AsyncClient(timeout=8.0) as client:
                res = await client.post(url, json={})
                if res.status_code == 200:
                    data = res.json()
                    loc = data.get("location", {})
                    lat = loc.get("lat")
                    lng = loc.get("lng")
                    acc = data.get("accuracy")
                    if lat and lng:
                        # Reverse geocode via Google
                        geo_res = await reverse_geocode(ReverseGeocodeRequest(latitude=lat, longitude=lng))
                        geo_res.accuracy = acc
                        return geo_res
        except Exception as e:
            print(f"Google Geolocation API error: {e}")

    # 2. Try IP-based location detection (with Google Reverse Geocode fallback)
    try:
        forwarded = request.headers.get("x-forwarded-for")
        client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "")
        
        # If client is localhost/loopback or private, query public egress IP
        is_local = not client_ip or client_ip in ["127.0.0.1", "localhost", "::1"] or client_ip.startswith("192.168.") or client_ip.startswith("10.")
        ip_url = "http://ip-api.com/json" if is_local else f"http://ip-api.com/json/{client_ip}"
        
        async with httpx.AsyncClient(timeout=4.0) as client:
            ip_res = await client.get(ip_url)
            if ip_res.status_code == 200:
                ip_data = ip_res.json()
                if ip_data.get("status") == "success":
                    lat = float(ip_data.get("lat", 26.7271))
                    lng = float(ip_data.get("lon", 88.3953))
                    city = ip_data.get("city") or "Local Area"
                    state = ip_data.get("regionName") or ip_data.get("region") or "West Bengal"
                    country = ip_data.get("country") or "India"
                    zip_code = ip_data.get("zip")

                    # Try reverse geocode with Google Maps API if key available
                    if api_key:
                        try:
                            geo_res = await reverse_geocode(ReverseGeocodeRequest(latitude=lat, longitude=lng))
                            geo_res.provider = "google_maps_ip_detected"
                            return geo_res
                        except Exception:
                            pass

                    return LocationResponse(
                        status="success",
                        provider="ip_network_geolocate",
                        latitude=lat,
                        longitude=lng,
                        city=city,
                        state=state,
                        country=country,
                        postal_code=zip_code,
                        formatted_address=f"{city}, {state}, {country}",
                        display_name=f"{city}, {state}"
                    )
    except Exception as e:
        print(f"IP auto-detect error: {e}")

    # 3. Default to Siliguri, West Bengal (Reference screenshot center)
    return LocationResponse(
        status="success",
        provider="default_preset",
        latitude=26.7271,
        longitude=88.3953,
        city="Siliguri",
        state="West Bengal",
        district="Darjeeling",
        country="India",
        postal_code="734001",
        formatted_address="Siliguri, West Bengal, India",
        display_name="Siliguri, West Bengal"
    )
