// import React, { ChangeEvent, FormEvent } from "react";
// import { Link } from "react-router-dom";
// import api from "@/api/axios";
// import { useAuth } from "@/store/auth";

// import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
// import InputWithLabel from "@/components/custom/InputWithLabel";

// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { cn } from "@/lib/utils"; // helper from shadcn template
// import { Check } from "lucide-react";


// import { MapSelectorDialog } from "@/components/custom/MapSelectorDialog";
// import barangays from "@/data/barangays.json";

// type FormData = {
//   name: string;
//   contact_number: string;
//   email: string;
//   password: string;
//   password_confirmation: string;
//   role: "worker" | "employer";
//   skills?: string;
//   experience?: string;
//   business_name?: string;
//   address?: string;
//   lat?: string;
//   lng?: string;
// };

// const Register = () => {
//   const { login } = useAuth();
//   const [loading, setLoading] = React.useState<boolean>(false);
//   const [formData, setFormData] = React.useState<FormData>({
//     name: "",
//     contact_number: "",
//     email: "",
//     password: "",
//     password_confirmation: "",
//     role: "worker",
//     skills: "",
//     experience: "",
//     business_name: "",
//     address: "",
//     lat: "",
//     lng: "",
//   });
//   const [errors, setErrors] = React.useState<string | null>(null);

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setErrors(null);
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors(null);

//     try {
//       const res = await api.post("/register", formData);
//       login(res.data.user, res.data.access_token); // backend should return { user, token }
//       setLoading(false);
//     } catch (err: any) {
//       setErrors(err.response?.data?.message || "Registration failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen py-12 flex items-center justify-center">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
//         <Card className="max-w-md mx-auto w-full">
//           <CardHeader className="flex items-center">
//             <CardTitle>
//               <div className="flex flex-col gap-4 w-full text-center">
//                 <span>Register</span>
//               </div>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//               {errors && (
//                 <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 w-full text-center">
//                   <span className="text-destructive text-sm">{errors}</span>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 <div className="flex flex-col gap-3">
//                   <Label htmlFor="role">Register As</Label>
//                   <Select
//                     value={formData.role}
//                     onValueChange={(value) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         role: value as "worker" | "employer",
//                       }))
//                     }
//                   >
//                     <SelectTrigger id="role">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="worker">Worker</SelectItem>
//                       <SelectItem value="employer">Employer</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <InputWithLabel
//                   id="name"
//                   name="name"
//                   type="text"
//                   label="Full Name"
//                   placeholder="Enter your full name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />

//                 <InputWithLabel
//                   id="contact_number"
//                   name="contact_number"
//                   type="text"
//                   label="Contact Number"
//                   placeholder="09XXXXXXXXX"
//                   value={formData.contact_number}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />

//                 <InputWithLabel
//                   id="email"
//                   name="email"
//                   type="email"
//                   label="Email"
//                   placeholder="Enter your email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />

//                 <InputWithLabel
//                   id="password"
//                   name="password"
//                   type="password"
//                   label="Password"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />

//                 <InputWithLabel
//                   id="password_confirmation"
//                   name="password_confirmation"
//                   type="password"
//                   label="Confirm Password"
//                   placeholder="Confirm your password"
//                   value={formData.password_confirmation}
//                   onChange={handleChange}
//                   disabled={loading}
//                 />


//                 {/* Conditional Fields */}
//                 {formData.role === "worker" && (
//                   <>
//                     <InputWithLabel
//                       id="skills"
//                       name="skills"
//                       type="text"
//                       label="Skills"
//                       placeholder="e.g. Carpentry, Plumbing"
//                       value={formData.skills || ""}
//                       onChange={handleChange}
//                       disabled={loading}
//                     />
//                     <InputWithLabel
//                       id="experience"
//                       name="experience"
//                       type="text"
//                       label="Experience"
//                       placeholder="e.g. 5 years in construction"
//                       value={formData.experience || ""}
//                       onChange={handleChange}
//                       disabled={loading}
//                     />
//                   </>
//                 )}

//                 {formData.role === "employer" && (
//                   <InputWithLabel
//                     id="business_name"
//                     name="business_name"
//                     type="text"
//                     label="Business Name"
//                     placeholder="Enter your business name"
//                     value={formData.business_name || ""}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 )}

//                 <div className="flex flex-col gap-3">
//                   <Label htmlFor="address">Address (Barangay)</Label>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <button
//                         type="button"
//                         className={cn(
//                           "w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
//                           !formData.address && "text-muted-foreground"
//                         )}
//                       >
//                         {formData.address
//                           ? formData.address
//                           : "Select barangay"}
//                       </button>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-[300px] p-0">
//                       <Command>
//                         <CommandInput placeholder="Search barangay..." />
//                         <CommandList>
//                           <CommandEmpty>No results found.</CommandEmpty>
//                           <CommandGroup className="max-h-60 overflow-y-auto">
//                             {barangays.map((b) => {
//                               const value = `${b.name}, ${b.municipality}`;
//                               return (
//                                 <CommandItem
//                                   key={value}
//                                   value={value}
//                                   onSelect={() => {
//                                     setFormData((prev) => ({
//                                       ...prev,
//                                       address: value,
//                                       lat: b.lat.toString(),
//                                       lng: b.lng.toString(),
//                                     }));
//                                   }}
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 h-4 w-4",
//                                       formData.address === value ? "opacity-100" : "opacity-0"
//                                     )}
//                                   />
//                                   {b.name}, {b.municipality}
//                                 </CommandItem>
//                               );
//                             })}
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                 </div>


//                 {/* Map Picker */}
//                 <div className="flex flex-col gap-3">
//                   <Label>Exact Location</Label>
//                   <MapSelectorDialog
//                     lat={formData.lat}
//                     lng={formData.lng}
//                     onSelect={(lat, lng) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         lat,
//                         lng,
//                       }))
//                     }
//                   />
//                   {/* <div className="text-sm text-muted-foreground">
//                     {formData.lat && formData.lng
//                       ? `Selected: Lat ${formData.lat}, Lng ${formData.lng}`
//                       : "No location selected"}
//                   </div> */}
//                 </div>
//               </div>

//               {/* Submit */}
//               <ButtonWithLoading
//                 type="submit"
//                 disabled={
//                   loading ||
//                   !formData.name ||
//                   !formData.email ||
//                   !formData.password ||
//                   !formData.password_confirmation
//                 }
//                 className="w-full mt-4"
//                 loading={loading}
//               >
//                 Register
//               </ButtonWithLoading>
//             </form>
//           </CardContent>
//           <CardFooter className="w-full text-center flex justify-center">
//             <p>
//               Already have an account?{" "}
//               <Link className="text-primary font-semibold" to="/">
//                 Login
//               </Link>
//             </p>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";

import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import InputWithLabel from "@/components/custom/InputWithLabel";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import { MapSelectorDialog } from "@/components/custom/MapSelectorDialog";
import barangays from "@/data/barangays.json";

type FormData = {
  name: string;
  contact_number: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "worker" | "employer";
  skills?: string;
  experience?: string;
  business_name?: string;
  location?: string;   // NEW: barangay + municipality (used to lookup location_id)
  lat?: string;
  lng?: string;
};

const Register = () => {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    contact_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "worker",
    skills: "",
    experience: "",
    business_name: "",
    location: "",
    lat: "",
    lng: "",
  });
  const [errors, setErrors] = React.useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    try {
      const res = await api.post("/register", formData);
      login(res.data.user, res.data.access_token);
      setLoading(false);
    } catch (err: any) {
      setErrors(err.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="max-w-md mx-auto w-full">
          <CardHeader className="flex items-center">
            <CardTitle>
              <div className="flex flex-col gap-4 w-full text-center">
                <span>Register</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errors && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 w-full text-center">
                  <span className="text-destructive text-sm">{errors}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Role */}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="role">Register As</Label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.value as "worker" | "employer",
                      }))
                    }
                    className="border rounded-md px-3 py-2 bg-background"
                    disabled={loading}
                  >
                    <option value="worker">Worker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>

                {/* Basic Info */}
                <InputWithLabel
                  id="name"
                  name="name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="contact_number"
                  name="contact_number"
                  type="text"
                  label="Contact Number"
                  placeholder="09XXXXXXXXX"
                  value={formData.contact_number}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />

                <InputWithLabel
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  disabled={loading}
                />

                {/* Worker Fields */}
                {formData.role === "worker" && (
                  <>
                    <InputWithLabel
                      id="skills"
                      name="skills"
                      type="text"
                      label="Skills"
                      placeholder="e.g. Carpentry, Plumbing"
                      value={formData.skills || ""}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <InputWithLabel
                      id="experience"
                      name="experience"
                      type="text"
                      label="Experience"
                      placeholder="e.g. 5 years in construction"
                      value={formData.experience || ""}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </>
                )}

                {/* Employer Fields */}
                {formData.role === "employer" && (
                  <InputWithLabel
                    id="business_name"
                    name="business_name"
                    type="text"
                    label="Business Name"
                    placeholder="Enter your business name"
                    value={formData.business_name || ""}
                    onChange={handleChange}
                    disabled={loading}
                  />
                )}

                {/* Location Selector */}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="location">Address (Barangay)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                          !formData.location && "text-muted-foreground"
                        )}
                      >
                        {formData.location
                          ? formData.location
                          : "Select barangay"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search barangay..." />
                        <CommandList>
                          <CommandEmpty>No results found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-y-auto">
                            {barangays.map((b) => {
                              const value = `${b.name}, ${b.municipality}`;
                              return (
                                <CommandItem
                                  key={value}
                                  value={value}
                                  onSelect={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      location: value,
                                      // lat: b.lat.toString(),
                                      // lng: b.lng.toString(),
                                    }));
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      formData.location === value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {b.name}, {b.municipality}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Map Picker */}
                <div className="flex flex-col gap-3">
                  <Label>Exact Location</Label>
                  <MapSelectorDialog
                    lat={formData.lat}
                    lng={formData.lng}
                    onSelect={(lat, lng) =>
                      setFormData((prev) => ({
                        ...prev,
                        lat,
                        lng,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Submit */}
              <ButtonWithLoading
                type="submit"
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.email ||
                  !formData.password ||
                  !formData.password_confirmation ||
                  !formData.location
                }
                className="w-full mt-4"
                loading={loading}
              >
                Register
              </ButtonWithLoading>
            </form>
          </CardContent>
          <CardFooter className="w-full text-center flex justify-center">
            <p>
              Already have an account?{" "}
              <Link className="text-primary font-semibold" to="/">
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
