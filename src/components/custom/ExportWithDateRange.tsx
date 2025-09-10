// import React, { useState } from "react";
// import axios from "axios";
// import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import "react-day-picker/dist/style.css";

// /* Replace these with your shadcn components imports if you use them */
// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import api from "@/api/axios";
// import ipconfig from "@/ipconfig";



// export default function ExportWithDateRange() {
//   // selected range as tuple [from, to] or undefined
//   const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const formatDate = (d?: Date) => d ? format(d, "yyyy-MM-dd") : undefined;

//   const validateRange = (from?: Date, to?: Date) => {
//     if (!from || !to) return false;
//     return from <= to;
//   };

//   const handleExport = async (type: "excel" | "pdf") => {
//     setError(null);

//     const fromDate = formatDate(range.from);
//     const toDate = formatDate(range.to);

//     if ((fromDate && !toDate) || (!fromDate && toDate)) {
//       setError("Please select both start and end dates, or clear the range to export all.");
//       return;
//     }

//     if (fromDate && toDate && !validateRange(range.from, range.to)) {
//       setError("Invalid date range: start date must be before or equal to end date.");
//       return;
//     }

//     setLoading(true);
//     try {
//       const url = `${ipconfig}/api/reports/patients/export/${type}`;

//       const response = await api.get(url, {
//         params: {
//           ...(fromDate ? { from_date: fromDate } : {}),
//           ...(toDate ? { to_date: toDate } : {}),
//         },
//         responseType: "blob",
//       });

//       // determine extension & mime
//       const ext = type === "excel" ? "xlsx" : "pdf";
//       const mime = type === "excel"
//         ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         : "application/pdf";

//       // create file name with range
//       const nameSuffix = fromDate && toDate ? `_${fromDate}_to_${toDate}` : "";
//       const filename = `patient_records${nameSuffix}.${ext}`;

//       const blob = new Blob([response.data], { type: mime });
//       const downloadUrl = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = downloadUrl;
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(downloadUrl);
//     } catch (err: any) {
//       console.error("Export error:", err);
//       // if server returned JSON error blob, try to parse message
//       if (err?.response?.data) {
//         try {
//           // attempt to read JSON text if backend returned JSON
//           const text = await err.response.data.text?.();
//           if (text) {
//             const parsed = JSON.parse(text);
//             setError(parsed.message || "Export failed. See console for details.");
//           } else {
//             setError("Export failed. See console for details.");
//           }
//         } catch {
//           setError("Export failed. See console for details.");
//         }
//       } else {
//         setError("Export failed. See console for details.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearRange = () => setRange({});

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-3">
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline">
//               {range.from && range.to
//                 ? `${format(range.from, "MMM d, yyyy")} — ${format(range.to, "MMM d, yyyy")}`
//                 : "Select date range"}
//             </Button>
//           </PopoverTrigger>

//           <PopoverContent align="start" className="w-auto p-4">
//             <div className="flex flex-col gap-3">
//               <div>
//                 <Label>Choose range</Label>
//                 <DayPicker
//                   mode="range"
//                   selected={range as any}
//                   onSelect={(newRange) => {
//                     // newRange may be undefined or Range
//                     setRange({ from: newRange?.from, to: newRange?.to });
//                   }}
//                   footer={
//                     <div className="flex items-center justify-between mt-2">
//                       <div className="text-sm text-muted-foreground">
//                         {range.from && range.to
//                           ? `${format(range.from, "PP")} — ${format(range.to, "PP")}`
//                           : "Pick start and end dates"}
//                       </div>
//                       <div className="flex gap-2">
//                         <Button size="sm" variant="ghost" onClick={clearRange}>Clear</Button>
//                       </div>
//                     </div>
//                   }
//                 />
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>

//         <div className="flex gap-2">
//           <Button onClick={() => handleExport("excel")} disabled={loading}>
//             {loading ? "Exporting..." : "Export Excel"}
//           </Button>
//           <Button onClick={() => handleExport("pdf")} disabled={loading}>
//             {loading ? "Exporting..." : "Export PDF"}
//           </Button>
//         </div>
//       </div>

//       {error && <div className="text-sm text-red-600">{error}</div>}

//       <div className="text-sm text-muted-foreground">
//         Hint: leave range empty to export each patient’s latest record (all time), or select a date range to export latest record per patient within that range.
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import axios from "axios";
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ipconfig from "@/ipconfig";
import { Input } from "../ui/input";
import { Download } from "lucide-react";
import api from "@/api/axios";

type Mode = "range" | "year" | "month";

export default function ExportWithDateRange() {
  const [mode, setMode] = useState<Mode>("range");

  // range
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});

  // year & month
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1); // 1-12

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (d?: Date) => (d ? format(d, "yyyy-MM-dd") : undefined);

  const getRange = (): { from?: string; to?: string } => {
    if (mode === "range" && range.from && range.to) {
      return { from: formatDate(range.from), to: formatDate(range.to) };
    }
    if (mode === "year") {
      const from = startOfYear(new Date(year, 0, 1));
      const to = endOfYear(new Date(year, 0, 1));
      return { from: formatDate(from), to: formatDate(to) };
    }
    if (mode === "month") {
      const from = startOfMonth(new Date(year, month - 1, 1));
      const to = endOfMonth(new Date(year, month - 1, 1));
      return { from: formatDate(from), to: formatDate(to) };
    }
    return {};
  };

  const handleExport = async (type: "excel" | "pdf") => {
    setError(null);
    setLoading(true);

    const { from, to } = getRange();

    try {
      const response = await api.get(`${ipconfig}/api/reports/patients/export/${type}`, {
        params: { from_date: from, to_date: to },
        responseType: "blob",
      });

      const ext = type === "excel" ? "xlsx" : "pdf";
      const filename = `patients_${mode}${from && to ? `_${from}_to_${to}` : ""}.${ext}`;

      const blob = new Blob([response.data], {
        type:
          type === "excel"
            ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed", err);
      setError("Export failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };
  
  const clearRange = () => setRange({});

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="flex items-center gap-4">
        <Label>Select Mode</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="range">Date Range</SelectItem>
            <SelectItem value="year">Yearly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mode Inputs */}
      {mode === "range" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              {range.from && range.to
                ? `${format(range.from, "MMM d, yyyy")} — ${format(range.to, "MMM d, yyyy")}`
                : "Select date range"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-4">
            <DayPicker
              mode="range"
              selected={range as any}
              onSelect={(r) => setRange({ from: r?.from, to: r?.to })}
                footer={
                    <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-muted-foreground">
                        {range.from && range.to
                            ? `${format(range.from, "PP")} — ${format(range.to, "PP")}`
                            : "Pick start and end dates"}
                        </div>
                        <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={clearRange}>Clear</Button>
                        </div>
                    </div>
                }
            />
          </PopoverContent>
        </Popover>
      )}

      {mode === "year" && (
        <div className="flex items-center gap-2">
          <Label>Year</Label>
          <Input
            type="number"
            className="w-24"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
      )}

      {mode === "month" && (
        <div className="flex gap-4">
          <div>
            <Label>Year</Label>
            <Input
              type="number"
              className="w-24"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Month</Label>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }).map((_, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {format(new Date(2020, i, 1), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="grid grid-cols-2 gap-4 w-full">
        <Button variant="outline" className="h-16 flex flex-col gap-2 w-full" onClick={() => handleExport("excel")}>
            <Download className="h-6 w-6" />
            <span>Export to Excel</span>
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-2 w-full" onClick={() => handleExport("pdf")}>
            <Download className="h-6 w-6" />
            <span>Export to PDF</span>
        </Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
