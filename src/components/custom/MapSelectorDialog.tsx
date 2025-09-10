import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type MapSelectorDialogProps = {
  lat?: string;
  lng?: string;
  onSelect: (lat: string, lng: string) => void;
};

const LocationPicker = ({ onSelect }: { onSelect: (lat: string, lng: string) => void }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat.toString(), e.latlng.lng.toString());
    },
  });
  return null;
};

export function MapSelectorDialog({ lat, lng, onSelect }: MapSelectorDialogProps) {
  const [open, setOpen] = useState(false);
  const [tempLat, setTempLat] = useState<string | undefined>(lat);
  const [tempLng, setTempLng] = useState<string | undefined>(lng);

  const handleSelect = (newLat: string, newLng: string) => {
    setTempLat(newLat);
    setTempLng(newLng);
  };

  const handleConfirm = () => {
    if (tempLat && tempLng) {
      onSelect(tempLat, tempLng);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {lat && lng ? `Lat: ${lat}, Lng: ${lng}` : "Pick Location on Map"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select Location</DialogTitle>
        </DialogHeader>
        <div className="h-96 w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[tempLat ? parseFloat(tempLat) : 13.5833, tempLng ? parseFloat(tempLng) : 124.2333]} // Catanduanes approx
            zoom={10}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {tempLat && tempLng && (
              <Marker
                position={[parseFloat(tempLat), parseFloat(tempLng)]}
                icon={markerIcon}
              />
            )}
            <LocationPicker onSelect={handleSelect} />
          </MapContainer>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!tempLat || !tempLng}>
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
