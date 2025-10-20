import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface MapEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  height?: string;
}

export default function ViewMap({
  lat,
  lng,
  zoom = 14,
  height = "400px",
}: MapEmbedProps) {
  // Generate the embed URL dynamically
  const mapUrl = useMemo(
    () =>
      `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`,
    [lat, lng, zoom]
  );

  return (
    <Card className="shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <iframe
          key={mapUrl} // ensures reload when coords change
          src={mapUrl}
          width="100%"
          height={height}
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-2xl"
        />
      </CardContent>
    </Card>
  );
}