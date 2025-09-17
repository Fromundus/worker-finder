// import * as React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { Compass, MapPin, LocateFixed, X, Star } from "lucide-react";
// import api from "@/api/axios";
// import { useAuth } from "@/store/auth";
// import { toast } from "@/hooks/use-toast";
// import { Badge } from "./ui/badge";

// function isValidNumber(v: any) {
//   return v !== null && v !== undefined && Number.isFinite(Number(v));
// }

// function parseLatLng(raw: any): { lat: number; lng: number } | null {
//   if (!raw) return null;
//   const candidates = [
//     { lat: raw.lat, lng: raw.lng },
//     { lat: raw.latitude, lng: raw.longitude },
//     { lat: raw.latitude, lng: raw.lngitude },
//     { lat: raw.y, lng: raw.x },
//     raw.location && { lat: raw.location.lat, lng: raw.location.lng },
//     raw.coordinates && Array.isArray(raw.coordinates) && { lat: raw.coordinates[1], lng: raw.coordinates[0] },
//     raw.geometry && raw.geometry.coordinates && Array.isArray(raw.geometry.coordinates) && { lat: raw.geometry.coordinates[1], lng: raw.geometry.coordinates[0] },
//   ];

//   for (const c of candidates) {
//     if (!c) continue;
//     const lat = Number((c as any).lat);
//     const lng = Number((c as any).lng);
//     if (isValidNumber(lat) && isValidNumber(lng)) {
//       return { lat, lng };
//     }
//   }
//   return null;
// }

// function makeCustomIcon(type: "worker" | "job", label?: string) {
//   const isWorker = type === "worker";
//   const bgColor = isWorker ? "#22c55e" : "#2563eb"; // green for workers, blue for 
//   const iconUrl = isWorker ?
//   "https://www.svgrepo.com/show/401337/construction-worker-medium-skin-tone.svg" :
//   "https://www.svgrepo.com/show/513276/briefcase.svg"

//   return L.divIcon({
//     className: "custom-map-marker",
//     html: `
//       <div style="display:flex;align-items:center;gap:6px">
//         <div style="
//           display:flex;
//           align-items:center;
//           gap:4px;
//           background:${bgColor};
//           color:white;
//           padding:4px 8px;
//           border-radius:6px;
//           font-size:12px;
//           font-weight:600;
//         ">
//           ${label ?? ""}
//         </div>
//         <img src="${iconUrl}" style="width: 28px; height: 28px;" />
//       </div>
//     `,
//     iconSize: [130, 36],
//     iconAnchor: [65, 18],
//   });
// }


// const MapFinderDialog: React.FC = () => {
//   const { user } = useAuth();
//   const [open, setOpen] = React.useState(false);

//   const [center, setCenter] = React.useState<{ lat: number; lng: number } | null>(null);

//   // radius state
//   const [radiusKm, setRadiusKm] = React.useState<number | "">(5);
//   const [debouncedRadiusKm, setDebouncedRadiusKm] = React.useState<number | "">(5);

//   // debounce radius
//   React.useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedRadiusKm(radiusKm);
//     }, 500); // 500ms debounce
//     return () => clearTimeout(handler);
//   }, [radiusKm]);

//   const radiusMeters =
//     typeof debouncedRadiusKm === "number" && debouncedRadiusKm > 0
//       ? debouncedRadiusKm * 1000
//       : null;

//   const [useProfileLocation, setUseProfileLocation] = React.useState<boolean>(true);

//   const [locations, setLocations] = React.useState<any[]>([]);
//   const [loading, setLoading] = React.useState(false);
//   const mapRef = React.useRef<L.Map | null>(null);

//   // pick center (profile or geolocation)
//   React.useEffect(() => {
//     if (!open) return;

//     const applyProfileIfAvailable = () => {
//       if (
//         useProfileLocation &&
//         user &&
//         isValidNumber(Number(user.lat)) &&
//         isValidNumber(Number(user.lng))
//       ) {
//         setCenter({ lat: Number(user.lat), lng: Number(user.lng) });
//         return true;
//       }
//       return false;
//     };

//     if (applyProfileIfAvailable()) return;

//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
//         },
//         (err) => {
//           console.error("Geolocation error:", err);
//           toast({
//             title: "Location error",
//             description: "Unable to get your current location. Try profile location.",
//             variant: "destructive",
//           });
//           applyProfileIfAvailable();
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     } else {
//       toast({
//         title: "No geolocation",
//         description: "Your browser does not support geolocation.",
//         variant: "destructive",
//       });
//     }
//   }, [open, useProfileLocation, user?.lat, user?.lng]);

//   React.useEffect(() => {
//     if (!open) return;
//     const t = setTimeout(() => {
//       if (mapRef.current) {
//         mapRef.current.invalidateSize();
//         if (center) {
//           mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom() ?? 13);
//         }
//       }
//     }, 150);
//     return () => clearTimeout(t);
//   }, [open, center]);

//   // Fetch nearby markers when center & debounced radius available
//   React.useEffect(() => {
//     let cancelled = false;
//     const fetchNearby = async () => {
//       if (!center) return;
//       if (!radiusMeters) return;
//       setLoading(true);
//       const endpoint = user?.role === "employer" ? "/map/workers" : "/map/jobs";
//       try {
//         const res = await api.get(endpoint, {
//           params: { lat: center.lat, lng: center.lng, radius: radiusMeters },
//         });

//         console.log(res);

//         if (cancelled) return;

//         const arr: any[] = Array.isArray(res.data) ? res.data : [];

//         const sanitized = arr
//           .map((it) => {
//             const p = parseLatLng(it);
//             if (!p) return null;
//             return { ...it, lat: p.lat, lng: p.lng };
//           })
//           .filter(Boolean);

//         setLocations(sanitized);

//         setTimeout(() => {
//           if (!mapRef.current) return;
//           const map = mapRef.current;
//           const points: LatLngExpression[] = sanitized.map((s) => [s.lat, s.lng]);
//           if (points.length > 0) {
//             const all = L.latLngBounds([...points, [center.lat, center.lng]]);
//             try {
//               map.fitBounds(all, { padding: [60, 60] });
//             } catch {
//               map.setView([center.lat, center.lng], 13);
//             }
//           } else {
//             map.setView([center.lat, center.lng], 13);
//           }
//           map.invalidateSize();
//         }, 200);
//       } catch (err) {
//         console.error("Error fetching map locations:", err);
//         toast({
//           title: "Error",
//           description: "Failed to fetch nearby locations",
//           variant: "destructive",
//         });
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchNearby();
//     return () => {
//       cancelled = true;
//     };
//   }, [center, radiusMeters, user?.role]);

//   const handleRecenter = () => {
//     if (!mapRef.current || !center) return;
//     const zoom = mapRef.current.getZoom() ?? 13;
//     mapRef.current.flyTo([center.lat, center.lng], zoom);
//     setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 200);
//   };

//   const safeApply = async (jobId: number) => {
//     try {
//       await api.post("/applications", { job_post_id: jobId });
//       toast({ title: "Applied", description: "Your application was submitted." });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: err.response.data.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const onRadiusChange = (val: string) => {
//     if (val === "") {
//       setRadiusKm("");
//       return;
//     }
//     const n = Number(val);
//     if (!Number.isNaN(n)) setRadiusKm(n);
//   };
  
//   console.log(locations);

//   const handleBookWorker = async (workerId: number) => {
//     try {
//       const res = await api.post("/bookings", {
//         worker_id: workerId,
//       });

//       toast({
//         title: "Booking created",
//         description: "The worker has been booked. Waiting for their confirmation.",
//       });

//       return res.data; // booking response
//     } catch (err: any) {
//       console.error("Booking error:", err);
//       toast({
//         title: "Error",
//         description: err.response?.data?.message || "Failed to create booking",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline">
//           <MapPin className="h-4 w-4 mr-2" /> Open Map Finder
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="w-screen h-screen max-w-none p-0">
//         {/* Close */}
//         <div className="absolute top-4 right-4 z-[1200]">
//           <Button variant="outline" className="rounded-full w-10 h-10" onClick={() => setOpen(false)}>
//             <X />
//           </Button>
//         </div>

//         {/* Header controls */}
//         <DialogHeader className="absolute top-4 left-4 z-[1200] bg-background rounded-md shadow p-4 space-y-3 w-fit">
//           <div>
//             <DialogTitle>{user?.role === "employer" ? "Worker Finder" : "Job Finder"}</DialogTitle>
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-2">
//               <Input
//                 type="number"
//                 step="0.5"
//                 min={0}
//                 value={radiusKm === "" ? "" : radiusKm}
//                 onChange={(e) => onRadiusChange(e.target.value)}
//                 className="w-24"
//               />
//               <span className="text-sm">km</span>
//             </div>

//             <div className="flex items-center gap-1">
//               <Button
//                 size="sm"
//                 variant={useProfileLocation ? "default" : "outline"}
//                 onClick={() => setUseProfileLocation(true)}
//               >
//                 <MapPin className="h-4 w-4 mr-1" />
//                 Profile
//               </Button>
//               <Button
//                 size="sm"
//                 variant={!useProfileLocation ? "default" : "outline"}
//                 onClick={() => setUseProfileLocation(false)}
//               >
//                 <LocateFixed className="h-4 w-4 mr-1" />
//                 Current
//               </Button>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Recenter */}
//         <div className="absolute bottom-6 right-6 z-[1200]">
//           <Button
//             className="rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
//             onClick={handleRecenter}
//             title="Recenter to your location"
//           >
//             <Compass className="h-5 w-5" />
//           </Button>
//         </div>

//         {/* Map */}
//         <div className="w-full h-full">
//           {center ? (
//             <MapContainer
//               center={[center.lat, center.lng]}
//               zoom={13}
//               scrollWheelZoom
//               zoomControl={false}
//               whenCreated={(mapInstance) => {
//                 mapRef.current = mapInstance;
//                 setTimeout(() => mapInstance.invalidateSize(), 120);
//               }}
//               className="w-full h-full"
//             >
//               <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution="&copy; OpenStreetMap contributors"
//               />

//               <Marker position={[center.lat, center.lng]}>
//                 <Popup>{useProfileLocation ? "Profile Location" : "Your Location"}</Popup>
//               </Marker>

//               {radiusMeters && (
//                 <Circle
//                   center={[center.lat, center.lng]}
//                   radius={radiusMeters}
//                   pathOptions={{ color: "#2563eb", fillOpacity: 0.05 }}
//                 />
//               )}

//               {locations.map((loc, idx) => {
//                 console.log(loc);
//                 if (!isValidNumber(loc.lat) || !isValidNumber(loc.lng)) return null;
//                 const pos: LatLngExpression = [Number(loc.lat), Number(loc.lng)];
//                 const key = `loc-${loc.id ?? idx}`;
//                 const label =
//                   user?.role === "employer"
//                     ? loc.user?.name ?? loc.name ?? "Worker"
//                     : loc.title ?? "Job";

//                 return (
//                   <Marker key={key} position={pos} icon={makeCustomIcon(user?.role === "employer" ? "worker" : "job", String(label).slice(0, 22))}>
//                     <Popup>
//                       <div className="space-y-2 w-[300px]">
//                         {user?.role === "worker" ? (
//                           <>
//                             <div className="space-y-2">
//                               <span className="text-lg font-semibold">Job Info</span>
//                               <div className="font-semibold">{loc.title ?? "Job"}</div>
//                               <div>{loc.description ?? "N/A"}</div>
//                               <div><Badge className="bg-blue-500 text-white">{loc.job_type ?? "N/A"}</Badge></div>
//                               <div>Php {loc.salary ?? "N/A"}</div>
//                             </div>

//                             <div className="flex flex-col gap-2 pt-2">
//                               <span className="text-lg font-semibold">Employer Info</span>
//                               <div>{loc.user.name ?? "Employer"}</div>
//                               <div>{loc.user.contact_number ?? "N/A"}</div>
//                               <div>{loc.user.email ?? "N/A"}</div>
//                               <div className="flex flex-col">
//                                 <span className="font-semibold">Rating</span>
//                                 <span className="flex items-center gap-2"><Star className="text-yellow-500" size={15} /> {loc.average_rating ?? '0'}</span>
//                               </div>
//                             </div>

//                             <div className="flex flex-col gap-2 pt-2">
//                               <span className="text-lg font-semibold">Address</span>
//                               <div className="flex items-start gap-2">
//                                 <div>{loc.location.barangay ?? "N/A"},</div>
//                                 <div>{loc.location.municipality ?? "N/A"}</div>
//                               </div>
//                             </div>

//                             <div className="pt-4 w-full flex justify-end">
//                               <Button className="bg-blue-500 text-white hover:bg-blue-700" onClick={() => safeApply(loc.id)}>
//                                 Apply
//                               </Button>
//                             </div>
//                           </>
//                         ) : (
//                           <>
//                             <div className="space-y-2">
//                               <span className="text-lg font-semibold">Worker Info</span>
//                               <div className="font-semibold">{loc.name ?? "Worker"}</div>
//                               <div>{loc.contact_number ?? "N/A"}</div>
//                               <div>{loc.email ?? "N/A"}</div>
//                               <div className="flex flex-col">
//                                 <span className="font-semibold">Rating</span>
//                                 <span className="flex items-center gap-2"><Star className="text-yellow-500" size={15} /> {loc.average_rating ?? '0'}</span>
//                               </div>
//                             </div>
//                             <div className="flex flex-col gap-2 pt-2">
//                               <span className="text-lg font-semibold">Skills</span>
//                               <div className="flex flex-wrap gap-2"> 
//                                 {loc.skills
//                                   ? loc.skills.split(",").map((skill: string, i: number) => (
//                                       <Badge key={i} className="bg-blue-500 text-white">
//                                         {skill.trim()}
//                                       </Badge>
//                                     ))
//                                   : <p className="text-muted-foreground text-sm">No skills listed</p>}
//                               </div>
//                             </div>

//                             <div className="flex flex-col gap-2 pt-2">
//                               <span className="text-lg font-semibold">Experience</span>
//                               <div>{loc.experience ?? "N/A"}</div>
//                             </div>

//                             <div className="flex flex-col gap-2 pt-2">
//                               <span className="text-lg font-semibold">Address</span>
//                               <div className="flex items-start gap-2">
//                                 <div>{loc.barangay ?? "N/A"},</div>
//                                 <div>{loc.municipality ?? "N/A"}</div>
//                               </div>
//                             </div>

//                             <div className="pt-4 w-full flex justify-end">
//                               <Button className="bg-blue-500 text-white hover:bg-blue-700" onClick={() => handleBookWorker(loc.id)}>
//                                 Book Worker
//                               </Button>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </Popup>
//                   </Marker>
//                 );
//               })}
//             </MapContainer>
//           ) : (
//             <div className="flex h-full w-full items-center justify-center">
//               <div className="text-sm text-muted-foreground p-4">Loading map...</div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default MapFinderDialog;

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Compass, MapPin, LocateFixed, X, Star } from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import MessageButton from "./MessageButton";

function isValidNumber(v: any) {
  return v !== null && v !== undefined && Number.isFinite(Number(v));
}

function parseLatLng(raw: any): { lat: number; lng: number } | null {
  if (!raw) return null;
  const candidates = [
    { lat: raw.lat, lng: raw.lng },
    { lat: raw.latitude, lng: raw.longitude },
    { lat: raw.latitude, lng: raw.lngitude },
    { lat: raw.y, lng: raw.x },
    raw.location && { lat: raw.location.lat, lng: raw.location.lng },
    raw.coordinates && Array.isArray(raw.coordinates) && { lat: raw.coordinates[1], lng: raw.coordinates[0] },
    raw.geometry && raw.geometry.coordinates && Array.isArray(raw.geometry.coordinates) && { lat: raw.geometry.coordinates[1], lng: raw.geometry.coordinates[0] },
  ];

  for (const c of candidates) {
    if (!c) continue;
    const lat = Number((c as any).lat);
    const lng = Number((c as any).lng);
    if (isValidNumber(lat) && isValidNumber(lng)) {
      return { lat, lng };
    }
  }
  return null;
}

function makeCustomIcon(type: "worker" | "job", label?: string) {
  const isWorker = type === "worker";
  const bgColor = isWorker ? "#22c55e" : "#2563eb"; // green for workers, blue for jobs
  const iconUrl = isWorker
    ? "https://www.svgrepo.com/show/401337/construction-worker-medium-skin-tone.svg"
    : "https://www.svgrepo.com/show/513276/briefcase.svg";

  return L.divIcon({
    className: "custom-map-marker",
    html: `
      <div style="display:flex;align-items:center;gap:6px">
        <div style="
          display:flex;
          align-items:center;
          gap:4px;
          background:${bgColor};
          color:white;
          padding:4px 8px;
          border-radius:6px;
          font-size:12px;
          font-weight:600;
        ">
          ${label ?? ""}
        </div>
        <img src="${iconUrl}" style="width: 28px; height: 28px;" />
      </div>
    `,
    iconSize: [130, 36],
    iconAnchor: [65, 18],
  });
}

const MapFinderDialog: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const [center, setCenter] = React.useState<{ lat: number; lng: number } | null>(null);

  // radius state
  const [radiusKm, setRadiusKm] = React.useState<number | "">(5);
  const [debouncedRadiusKm, setDebouncedRadiusKm] = React.useState<number | "">(5);

  // booking dialog state
  const [bookingDialogOpen, setBookingDialogOpen] = React.useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = React.useState<number | null>(null);
  const [bookingData, setBookingData] = React.useState({
    job_title: "",
    description: "",
    salary: 0,
  });

  const handleChangeBookingData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setBookingData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    });
  }

  // debounce radius
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRadiusKm(radiusKm);
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [radiusKm]);

  const radiusMeters =
    typeof debouncedRadiusKm === "number" && debouncedRadiusKm > 0
      ? debouncedRadiusKm * 1000
      : null;

  const [useProfileLocation, setUseProfileLocation] = React.useState<boolean>(true);

  const [locations, setLocations] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  // pick center (profile or geolocation)
  React.useEffect(() => {
    if (!open) return;

    const applyProfileIfAvailable = () => {
      if (
        useProfileLocation &&
        user &&
        isValidNumber(Number(user.lat)) &&
        isValidNumber(Number(user.lng))
      ) {
        setCenter({ lat: Number(user.lat), lng: Number(user.lng) });
        return true;
      }
      return false;
    };

    if (applyProfileIfAvailable()) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error("Geolocation error:", err);
          toast({
            title: "Location error",
            description: "Unable to get your current location. Try profile location.",
            variant: "destructive",
          });
          applyProfileIfAvailable();
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      toast({
        title: "No geolocation",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
    }
  }, [open, useProfileLocation, user?.lat, user?.lng]);

  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
        if (center) {
          mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom() ?? 13);
        }
      }
    }, 150);
    return () => clearTimeout(t);
  }, [open, center]);

  // Fetch nearby markers when center & debounced radius available
  React.useEffect(() => {
    let cancelled = false;
    const fetchNearby = async () => {
      if (!center) return;
      if (!radiusMeters) return;
      setLoading(true);
      const endpoint = user?.role === "employer" ? "/map/workers" : "/map/jobs";
      try {
        const res = await api.get(endpoint, {
          params: { lat: center.lat, lng: center.lng, radius: radiusMeters },
        });

        console.log(res);

        if (cancelled) return;

        const arr: any[] = Array.isArray(res.data) ? res.data : [];

        const sanitized = arr
          .map((it) => {
            const p = parseLatLng(it);
            if (!p) return null;
            return { ...it, lat: p.lat, lng: p.lng };
          })
          .filter(Boolean);

        setLocations(sanitized);

        setTimeout(() => {
          if (!mapRef.current) return;
          const map = mapRef.current;
          const points: LatLngExpression[] = sanitized.map((s) => [s.lat, s.lng]);
          if (points.length > 0) {
            const all = L.latLngBounds([...points, [center.lat, center.lng]]);
            try {
              map.fitBounds(all, { padding: [60, 60] });
            } catch {
              map.setView([center.lat, center.lng], 13);
            }
          } else {
            map.setView([center.lat, center.lng], 13);
          }
          map.invalidateSize();
        }, 200);
      } catch (err) {
        console.error("Error fetching map locations:", err);
        toast({
          title: "Error",
          description: "Failed to fetch nearby locations",
          variant: "destructive",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNearby();
    return () => {
      cancelled = true;
    };
  }, [center, radiusMeters, user?.role]);

  const handleRecenter = () => {
    if (!mapRef.current || !center) return;
    const zoom = mapRef.current.getZoom() ?? 13;
    mapRef.current.flyTo([center.lat, center.lng], zoom);
    setTimeout(() => mapRef.current && mapRef.current.invalidateSize(), 200);
  };

  const safeApply = async (jobId: number) => {
    try {
      await api.post("/applications", { job_post_id: jobId });
      toast({ title: "Applied", description: "Your application was submitted." });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };

  const onRadiusChange = (val: string) => {
    if (val === "") {
      setRadiusKm("");
      return;
    }
    const n = Number(val);
    if (!Number.isNaN(n)) setRadiusKm(n);
  };

  // --- BOOKING LOGIC ---
  const openBookingDialog = (workerId: number) => {
    setSelectedWorkerId(workerId);
    setBookingData({
      job_title: "",
      description: "",
      salary: 0,
    });
    setBookingDialogOpen(true);
  };

  const handleSubmitBooking = async () => {
    if (!selectedWorkerId) return;
    try {
      await api.post("/bookings", {
        worker_id: selectedWorkerId,
        job_title: bookingData.job_title,
        description: bookingData.description,
        salary: bookingData.salary,
      });
      toast({
        title: "Booking created",
        description: "The worker has been booked. Waiting for their confirmation.",
      });
      setBookingDialogOpen(false);
    } catch (err: any) {
      console.error("Booking error:", err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  console.log(locations);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" /> Open Map Finder
          </Button>
        </DialogTrigger>

        <DialogContent className="w-screen h-screen max-w-none p-0">
          {/* Close */}
          <div className="absolute top-4 right-4 z-[1200]">
            <Button variant="outline" className="rounded-full w-10 h-10" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>

          {/* Header controls */}
          <DialogHeader className="absolute top-4 left-4 z-[1200] bg-background rounded-md shadow p-4 space-y-3 w-fit">
            <div>
              <DialogTitle>{user?.role === "employer" ? "Worker Finder" : "Job Finder"}</DialogTitle>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="0.5"
                  min={0}
                  value={radiusKm === "" ? "" : radiusKm}
                  onChange={(e) => onRadiusChange(e.target.value)}
                  className="w-24"
                />
                <span className="text-sm">km</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant={useProfileLocation ? "default" : "outline"}
                  onClick={() => setUseProfileLocation(true)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Profile
                </Button>
                <Button
                  size="sm"
                  variant={!useProfileLocation ? "default" : "outline"}
                  onClick={() => setUseProfileLocation(false)}
                >
                  <LocateFixed className="h-4 w-4 mr-1" />
                  Current
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Recenter */}
          <div className="absolute bottom-6 right-6 z-[1200]">
            <Button
              className="rounded-full h-12 w-12 flex items-center justify-center shadow-lg"
              onClick={handleRecenter}
              title="Recenter to your location"
            >
              <Compass className="h-5 w-5" />
            </Button>
          </div>

          {/* Map */}
          <div className="w-full h-full">
            {center ? (
              <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                scrollWheelZoom
                zoomControl={false}
                whenCreated={(mapInstance) => {
                  mapRef.current = mapInstance;
                  setTimeout(() => mapInstance.invalidateSize(), 120);
                }}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                <Marker position={[center.lat, center.lng]}>
                  <Popup>{useProfileLocation ? "Profile Location" : "Your Location"}</Popup>
                </Marker>

                {radiusMeters && (
                  <Circle
                    center={[center.lat, center.lng]}
                    radius={radiusMeters}
                    pathOptions={{ color: "#2563eb", fillOpacity: 0.05 }}
                  />
                )}

                {locations.map((loc, idx) => {
                  console.log(loc);
                  if (!isValidNumber(loc.lat) || !isValidNumber(loc.lng)) return null;
                  const pos: LatLngExpression = [Number(loc.lat), Number(loc.lng)];
                  const key = `loc-${loc.id ?? idx}`;
                  const label =
                    user?.role === "employer"
                      ? loc.user?.name ?? loc.name ?? "Worker"
                      : loc.title ?? "Job";

                  return (
                    <Marker
                      key={key}
                      position={pos}
                      icon={makeCustomIcon(user?.role === "employer" ? "worker" : "job", String(label).slice(0, 22))}
                    >
                      <Popup>
                        <div className="space-y-2 w-[300px]">
                          {user?.role === "worker" ? (
                            <>
                              <div className="space-y-2">
                                <span className="text-lg font-semibold">Job Info</span>
                                <div className="font-semibold">{loc.title ?? "Job"}</div>
                                <div>{loc.description ?? "N/A"}</div>
                                <div>
                                  <Badge className="bg-blue-500 text-white">{loc.job_type ?? "N/A"}</Badge>
                                </div>
                                <div>Php {loc.salary ?? "N/A"}</div>
                              </div>

                              <div className="flex flex-col gap-2 pt-2">
                                <span className="text-lg font-semibold">Employer Info</span>
                                <div>{loc.user.name ?? "Employer"}</div>
                                <div>{loc.user.contact_number ?? "N/A"}</div>
                                <div>{loc.user.email ?? "N/A"}</div>
                                <div className="flex flex-col">
                                  <span className="font-semibold">Rating</span>
                                  <span className="flex items-center gap-2">
                                    <Star className="text-yellow-500" size={15} /> {loc.average_rating ?? "0"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 pt-2">
                                <span className="text-lg font-semibold">Address</span>
                                <div className="flex items-start gap-2">
                                  <div>{loc.location.barangay ?? "N/A"},</div>
                                  <div>{loc.location.municipality ?? "N/A"}</div>
                                </div>
                              </div>

                              <div className="pt-4 w-full flex flex-wrap justify-end gap-2">
                                <MessageButton userId={loc.id} />
                                <Link to={`/${user.role}/jobs/${loc.id}`}>
                                    <Button variant="outline" className="bg-white border border-gray-300 hover:bg-white hover:text-blue-500">
                                      View Job
                                    </Button>
                                </Link>
                                <Link to={`/${user.role}/profile/${loc.user.id}`}>
                                    <Button variant="outline" className="bg-white border border-gray-300 hover:bg-white hover:text-blue-500">
                                      View Profile
                                    </Button>
                                </Link>
                                <Button
                                  className="bg-blue-500 text-white hover:bg-blue-700"
                                  onClick={() => safeApply(loc.id)}
                                >
                                  Apply
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="space-y-2">
                                <span className="text-lg font-semibold">Worker Info</span>
                                <div className="font-semibold">{loc.name ?? "Worker"}</div>
                                <div>{loc.contact_number ?? "N/A"}</div>
                                <div>{loc.email ?? "N/A"}</div>
                                <div className="flex flex-col">
                                  <span className="font-semibold">Rating</span>
                                  <span className="flex items-center gap-2">
                                    <Star className="text-yellow-500" size={15} /> {loc.average_rating ?? "0"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 pt-2">
                                <span className="text-lg font-semibold">Skills</span>
                                <div className="flex flex-wrap gap-2">
                                  {loc.skills
                                    ? loc.skills.split(",").map((skill: string, i: number) => (
                                        <Badge key={i} className="bg-blue-500 text-white">
                                          {skill.trim()}
                                        </Badge>
                                      ))
                                    : (
                                      <p className="text-muted-foreground text-sm">No skills listed</p>
                                    )}
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 pt-2">
                                <span className="text-lg font-semibold">Experience</span>
                                <div>{loc.experience ?? "N/A"}</div>
                              </div>

                              <div className="flex flex-col gap-2 pt-2">
                                <span className="text-lg font-semibold">Address</span>
                                <div className="flex items-start gap-2">
                                  <div>{loc.barangay ?? "N/A"},</div>
                                  <div>{loc.municipality ?? "N/A"}</div>
                                </div>
                              </div>

                              <div className="pt-4 w-full flex flex-wrap justify-end gap-2">
                                <MessageButton userId={loc.id} />
                                <Link to={`/${user.role}/profile/${loc.id}`}>
                                    <Button variant="outline" className="bg-white border border-gray-300 hover:bg-white hover:text-blue-500">
                                      View Profile
                                    </Button>
                                </Link>
                                <Button
                                  className="bg-blue-500 text-white hover:bg-blue-700"
                                  onClick={() => openBookingDialog(loc.id)}
                                >
                                  Book Worker
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-sm text-muted-foreground p-4">Loading map...</div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              name="job_title"
              placeholder="Booking Title"
              value={bookingData.job_title}
              onChange={handleChangeBookingData}
            />
            <Input
              type="number"
              name="salary"
              placeholder="Salary"
              value={bookingData.salary}
              onChange={handleChangeBookingData}
            />
            <Textarea
              name="description"
              placeholder="Booking Description"
              value={bookingData.description}
              onChange={(e) => {
                setBookingData((prev) => {
                  return {
                    ...prev,
                    description: e.target.value,
                  }
                })
              }}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled={!bookingData.job_title} onClick={handleSubmitBooking}>
                Book
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MapFinderDialog;
