import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  searchQuery: string
  onLocationSelect: (lat: number, lng: number, name: string) => void
  triggerSearch: boolean
}

function SearchBox({ setPosition }: { setPosition: (pos: [number, number], name: string) => void }) {
  const [query, setQuery] = useState("");
  const map = useMap();

  const searchLocation = async () => {
    if (!query) return;
    
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await res.json();

    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const pos: [number, number] = [parseFloat(lat), parseFloat(lon)];

      setPosition(pos, display_name);
      map.setView(pos, 14); // Zoom to location
    }
  };

  return ( 
    <Card 
      className="absolute top-2 left-2"
      style={{ zIndex: 1000 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <CardContent className="p-2 flex items-center gap-2">
        <Input
          type="text"
          placeholder="Search a location..."
          className="w-full border px-2 py-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchLocation()}
        />
        <Button onClick={searchLocation}>
          Search
        </Button>
      </CardContent>
    </Card>
  );
}

function LocationPicker({ searchQuery, triggerSearch, onLocationSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState("");
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

  // 🔍 Runs ONLY when triggerSearch changes (Button clicked)
  useEffect(() => {
    if (!triggerSearch || !searchQuery.trim()) return;

    const searchLocation = async () => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
      const data = await res.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        updatePosition([parseFloat(lat), parseFloat(lon)], display_name);
        map.setView([lat, lon], 15);
      }
    };

    searchLocation();
  }, [triggerSearch]); // 👈 Only runs when searchNow toggles

  const updatePosition = (pos: [number, number], name: string) => {
    setPosition(pos);
    setLocationName(name);
    onLocationSelect(pos[0], pos[1], name);
    setTimeout(() => markerRef.current?.openPopup(), 200);
  };

  // 🖱 Get location when clicking map
  useMapEvents({
    click: async ({ latlng }) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latlng.lat}&lon=${latlng.lng}&format=json`
      );
      const data = await res.json();
      updatePosition([latlng.lat, latlng.lng], data.display_name);
    }
  });

  return position && (
    <Marker position={position} ref={markerRef}>
      <Popup>{locationName}</Popup>
    </Marker>
  );
}

export default function MapModal({ data, setData }: { data: any, setData:  React.Dispatch<React.SetStateAction<any>> }) {
  const [query, setQuery] = useState("")
  const [searchNow, setSearchNow] = useState(false)

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    // console.log("Latitude:", lat)
    // console.log("Longitude:", lng)
    // console.log("Location:", name)
    setData((prev) => {
      return {
        ...prev,
        location: name,
        lat: lat,
        lng: lng,
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger type="button">
        <Button className="w-full" type="button" variant="outline">
          {(data?.lat && data?.lng) ? `Lat: ${data.lat}, Lng: ${data.lng}` : 'Pick Location'}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full mx-auto">

        {/* 🔍 Search bar OUTSIDE the map — cleaner UI */}
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Input 
              placeholder="Search location..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-80"
            />
            <Button onClick={() => setSearchNow(prev => !prev)}>Search</Button>
          </DialogTitle>
        </DialogHeader>

        {/* Map */}
        <div style={{ height: "75vh" }}>
          <MapContainer center={[13.7747,124.2340]} zoom={12} style={{height:"100%",width:"100%"}}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker
              searchQuery={query}
              triggerSearch={searchNow}
              onLocationSelect={handleLocationSelect}
            />
          </MapContainer>
        </div>

      </DialogContent>
    </Dialog>
  )
}