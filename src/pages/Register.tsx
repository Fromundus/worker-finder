import React, { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";

import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import InputWithLabel from "@/components/custom/InputWithLabel";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
import { Check, Trash } from "lucide-react";

import { MapSelectorDialog } from "@/components/custom/MapSelectorDialog";
import barangays from "@/data/barangays.json";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

type FormData = {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  contact_number: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "worker" | "employer";
  has_disability?: boolean;
  disabilities?: string; // 🆕 Changed to string for backend JSON encoding
  disability_specify?: string;

  skills?: string;
  experience?: string;

  employer_type?: string;

  business_name?: string;
  location?: string;
  lat?: string;
  lng?: string;

  // 🆕 NEW: from backend
  sex: string;
  religion: string;
  civil_status: string;
  height: string;

  // 🆕 NEW: images
  barangay_clearance_photo?: File | null;
  valid_id_photo?: File | null;
  selfie_with_id_photo?: File | null;
  business_permit_photo?: File | null;
  bir_certificate_photo?: File | null;

  // 🆕 NEW: dynamic sections
  educations: { level: string; school_name: string; course?: string; year_graduated?: string }[];
  certificates: { title: string; issuing_organization?: string; date_issued?: string; certificate_photo?: File | null }[];
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formData, setFormData] = React.useState<FormData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    suffix: "",
    contact_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "worker",
    has_disability: false,
    disabilities: "",
    disability_specify: "",

    skills: "",
    experience: "",

    employer_type: "establishment",

    business_name: "",
    location: "",
    lat: "",
    lng: "",

    sex: "",
    religion: "",
    civil_status: "",
    height: "",

    barangay_clearance_photo: null,
    valid_id_photo: null,
    selfie_with_id_photo: null,
    business_permit_photo: null,
    bir_certificate_photo: null,

    educations: [{ level: "", school_name: "", course: "", year_graduated: "" }],
    certificates: [{ title: "", issuing_organization: "", date_issued: "", certificate_photo: null }],
  });

  const [errors, setErrors] = React.useState<Record<string, string>>(null);

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

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setErrors(null);

  //   try {
  //     const res = await api.post("/register", formData);
  //     // login(res.data.user, res.data.access_token);
  //     console.log(res);
  //     setLoading(false);
  //     navigate('/login');
  //     toast({
  //       title: "Registered Sucessfully",
  //     })
  //   } catch (err: any) {
  //     console.log(err);
  //     setErrors(err.response?.data?.errors);
  //     setLoading(false);
  //   }
  // };

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setErrors(null);

  //   const data = new FormData();
  //   Object.entries(formData).forEach(([key, value]) => {
  //     if (Array.isArray(value)) {
  //       data.append(key, JSON.stringify(value));
  //     } else if (value instanceof File) {
  //       data.append(key, value);
  //     } else {
  //       data.append(key, value ?? "");
  //     }
  //   });

  //   try {
  //     const res = await api.post("/register", data, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });
  //     navigate("/login");
  //     toast({ title: "Registered Successfully" });
  //   } catch (err: any) {
  //     console.log(err);
  //     setErrors(err.response?.data?.errors);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // ✅ always initialize as object to avoid null errors

    try {
      const data = new FormData();

      // Append simple fields (excluding arrays)
      Object.entries(formData).forEach(([key, value]) => {
        if (["educations", "certificates"].includes(key)) return; // handle separately below
        if (value instanceof File) {
          data.append(key, value);
        } else if (typeof value === "boolean") {
          data.append(key, value ? "1" : "0");
        } else {
          data.append(key, value ?? "");
        }
      });

      // ✅ Append educations as JSON (no files)
      data.append("educations", JSON.stringify(formData.educations || []));

      // ✅ Append certificates properly (including photos)
      (formData.certificates || []).forEach((cert, i) => {
        data.append(`certificates[${i}][title]`, cert.title || "");
        data.append(`certificates[${i}][issuing_organization]`, cert.issuing_organization || "");
        data.append(`certificates[${i}][date_issued]`, cert.date_issued || "");
        if (cert.certificate_photo instanceof File) {
          data.append(`certificates[${i}][certificate_photo]`, cert.certificate_photo);
        }
      });

      // ✅ Send to backend
      const res = await api.post("/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({ title: "Registered Successfully" });
      // navigate("/login");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data?.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Card className="max-w-4xl mx-auto w-full">
          <CardHeader className="flex items-center">
            <CardTitle>
              <div className="flex flex-col gap-4 w-full text-center">
                <span>Register</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* {errors && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-2 w-full text-center">
                  <span className="text-destructive text-sm">{errors}</span>
                </div>
              )} */}

              <div className="space-y-4">
                <span className="text-lg font-semibold">Personal Information</span>
                {/* Role */}
                <div className="flex flex-col gap-3">
                  <Label htmlFor="role">Register As</Label>
                  <Select value={formData.role} onValueChange={(value) => {
                    setFormData(() => ({
                      first_name: "",
                      middle_name: "",
                      last_name: "",
                      suffix: "",
                      contact_number: "",
                      email: "",
                      password: "",
                      password_confirmation: "",
                      role: value as 'worker' | 'employer',
                      has_disability: false,
                      disabilities: "",
                      disability_specify: "",

                      skills: "",
                      experience: "",

                      employer_type: "establishment",

                      business_name: "",
                      location: "",
                      lat: "",
                      lng: "",

                      sex: "",
                      religion: "",
                      civil_status: "",
                      height: "",

                      barangay_clearance_photo: null,
                      valid_id_photo: null,
                      selfie_with_id_photo: null,
                      business_permit_photo: null,
                      bir_certificate_photo: null,

                      educations: [{ level: "", school_name: "", course: "", year_graduated: "" }],
                      certificates: [{ title: "", issuing_organization: "", date_issued: "", certificate_photo: null }],
                    }));
                    setErrors(null);
                    
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Worker</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors?.role && <span className="text-destructive">{errors?.role}</span>}
                </div>

                {/* Basic Info */}

                <div className="grid md:grid-cols-4 gap-4">
                  <InputWithLabel
                    id="first_name"
                    name="first_name"
                    type="text"
                    label="First Name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.first_name}
                  />

                  <InputWithLabel
                    id="middle_name"
                    name="middle_name"
                    type="text"
                    label="Middle Name"
                    placeholder="Enter your middle name"
                    value={formData.middle_name}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.middle_name}
                  />

                  <InputWithLabel
                    id="last_name"
                    name="last_name"
                    type="text"
                    label="Last Name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.last_name}
                  />

                  <InputWithLabel
                    id="suffix"
                    name="suffix"
                    type="text"
                    label="Suffix"
                    placeholder="Suffix"
                    value={formData.suffix}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.suffix}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <InputWithLabel
                    id="contact_number"
                    name="contact_number"
                    type="text"
                    label="Contact Number"
                    placeholder="09XXXXXXXXX"
                    value={formData.contact_number}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.contact_number}
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
                    error={errors?.email}
                  />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="role">Sex</Label>
                    <Select value={formData.sex} onValueChange={(value) => setFormData((prev) => ({ ...prev, sex: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors?.sex && <span className="text-destructive">{errors?.sex}</span>}
                  </div>
                  <InputWithLabel
                    id="religion"
                    name="religion"
                    type="text"
                    label="Religion"
                    placeholder="Enter your religion"
                    value={formData.religion}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.religion}
                  />
                  <InputWithLabel
                    id="civil_status"
                    name="civil_status"
                    type="text"
                    label="Civil Status"
                    placeholder="Single, Married, etc."
                    value={formData.civil_status}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.civil_status}
                  />
                  <InputWithLabel
                    id="height"
                    name="height"
                    type="text"
                    label="Height"
                    placeholder="e.g., 165 cm"
                    value={formData.height}
                    onChange={handleChange}
                    disabled={loading}
                    error={errors?.height}
                  />
                </div>

                {/* Location Selector */}
                <div className="grid md:grid-cols-2 gap-4">
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
                      {errors?.location && <span className="text-destructive text-sm">{errors?.location}</span>}
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
                    {errors?.lat && <span className="text-destructive text-sm">{errors?.lat}</span>}
                    {errors?.lng && <span className="text-destructive text-sm">{errors?.lng}</span>}
                  </div>
                </div>

                {/* ===================== DISABILITY SECTION ===================== */}
                <div className="space-y-2">
                  <Label>Do you have any disability?</Label>
                  <div className="flex gap-4 items-center">
                    <label className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="has_disability"
                        checked={formData.has_disability === true}
                        onChange={() => setFormData((prev) => ({ ...prev, has_disability: true }))}
                      />
                      Yes
                    </label>
                    <label className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="has_disability"
                        checked={formData.has_disability === false}
                        onChange={() => setFormData((prev) => ({ ...prev, has_disability: false, disabilities: "", disability_specify: "" }))}
                      />
                      No
                    </label>
                  </div>

                  {formData.has_disability && (
                    <div className="space-y-2">
                      <Label>Select Disability</Label>
                      <div className="grid md:grid-cols-3 gap-2">
                        {["Visual", "Hearing", "Mobility", "Speech", "Learning", "Intellectual", "Other"].map((d) => (
                          <label key={d} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={d}
                              checked={formData.disabilities?.includes(d)}
                              onChange={(e) => {
                                const val = e.target.value;
                                let updated = formData.disabilities ? formData.disabilities.split(",") : [];
                                if (updated.includes(val)) updated = updated.filter((x) => x !== val);
                                else updated.push(val);
                                setFormData((prev) => ({ ...prev, disabilities: updated.join(",") }));
                              }}
                            />
                            {d}
                          </label>
                        ))}
                      </div>
                      {formData.disabilities?.includes("Other") && (
                        <InputWithLabel
                          id="disability_specify"
                          name="disability_specify"
                          type="text"
                          label="Please specify"
                          placeholder="Specify disability"
                          value={formData.disability_specify || ""}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      )}
                      {errors?.disabilities && <span className="text-destructive text-sm">{errors.disabilities}</span>}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    error={errors?.password}
                  />
                </div>

                {/* Worker Fields */}
                {formData.role === "worker" && (
                  <>
                    {/* <InputWithLabel
                      id="skills"
                      name="skills"
                      type="text"
                      label="Skills"
                      placeholder="e.g. Carpentry, Plumbing"
                      value={formData.skills || ""}
                      onChange={handleChange}
                      disabled={loading}
                      error={errors?.skills}
                    /> */}
                    <div className="space-y-4">
                      <Label>Select Skills</Label>

                      <div className="grid md:grid-cols-3 gap-2">
                        {[
                          "Carpentry",
                          "Plumbing",
                          "Electrical Work",
                          "Housekeeping",
                          "Cooking",
                          "Driving",
                          "Gardening",
                          "Masonry",
                          "Painting",
                          "Laundry",
                          "Babysitting",
                          "Welding",
                          "Sewing",
                          "Other",
                        ].map((skill) => (
                          <label key={skill} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              value={skill}
                              checked={formData.skills?.split(",").includes(skill)}
                              onChange={(e) => {
                                const val = e.target.value;
                                let updated = formData.skills ? formData.skills.split(",") : [];
                                if (updated.includes(val)) {
                                  updated = updated.filter((s) => s !== val);
                                } else {
                                  updated.push(val);
                                }
                                setFormData((prev) => ({ ...prev, skills: updated.join(",") }));
                              }}
                              disabled={loading}
                            />
                            {skill}
                          </label>
                        ))}
                      </div>

                      {/* Custom skill input when "Other" is selected */}
                      {formData.skills?.includes("Other") && (
                        <InputWithLabel
                          id="skills_specify"
                          name="skills_specify"
                          type="text"
                          label="Please specify other skill"
                          placeholder="Specify skill"
                          value={formData.skills_specify || ""}
                          onChange={handleChange}
                          disabled={loading}
                        />
                      )}

                      {errors?.skills && (
                        <span className="text-destructive text-sm">{errors.skills}</span>
                      )}
                    </div>

                    <InputWithLabel
                      id="experience"
                      name="experience"
                      type="text"
                      label="Experience"
                      placeholder="e.g. 5 years in construction"
                      value={formData.experience || ""}
                      onChange={handleChange}
                      disabled={loading}
                      error={errors?.experience}
                    />
                  </>
                )}

                {/* ===================== EDUCATION SECTION ===================== */}
                <Separator />
                {formData.role === "worker" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Educational Background</span>

                      <Button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            educations: [
                              ...prev.educations,
                              { level: "", school_name: "", course: "", year_graduated: "" },
                            ],
                          }))
                        }
                        size="sm"
                      >
                        + Add Education
                      </Button>
                    </div>

                    {formData.educations.map((edu, i) => (
                      <div key={i} className="grid md:grid-cols-4 gap-3 border p-3 rounded-lg">
                        {/* LEVEL */}
                        <div>
                          <InputWithLabel
                            id={`edu_level_${i}`}
                            name="level"
                            type="text"
                            label="Level"
                            placeholder="e.g., College"
                            value={edu.level}
                            onChange={(e) => {
                              const newEdus = [...formData.educations];
                              newEdus[i].level = e.target.value;
                              setFormData((prev) => ({ ...prev, educations: newEdus }));
                            }}
                          />
                          {errors?.[`educations.${i}.level`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`educations.${i}.level`][0]}
                            </p>
                          )}
                        </div>

                        {/* SCHOOL NAME */}
                        <div>
                          <InputWithLabel
                            id={`edu_school_${i}`}
                            name="school_name"
                            type="text"
                            label="School Name"
                            placeholder="Enter school name"
                            value={edu.school_name}
                            onChange={(e) => {
                              const newEdus = [...formData.educations];
                              newEdus[i].school_name = e.target.value;
                              setFormData((prev) => ({ ...prev, educations: newEdus }));
                            }}
                          />
                          {errors?.[`educations.${i}.school_name`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`educations.${i}.school_name`][0]}
                            </p>
                          )}
                        </div>

                        {/* COURSE */}
                        <div>
                          <InputWithLabel
                            id={`edu_course_${i}`}
                            name="course"
                            type="text"
                            label="Course"
                            placeholder="Enter course (optional)"
                            value={edu.course || ""}
                            onChange={(e) => {
                              const newEdus = [...formData.educations];
                              newEdus[i].course = e.target.value;
                              setFormData((prev) => ({ ...prev, educations: newEdus }));
                            }}
                          />
                          {errors?.[`educations.${i}.course`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`educations.${i}.course`][0]}
                            </p>
                          )}
                        </div>

                        {/* YEAR GRADUATED */}
                        <div>
                          <InputWithLabel
                            id={`edu_year_${i}`}
                            name="year_graduated"
                            type="text"
                            label="Year Graduated"
                            placeholder="YYYY"
                            value={edu.year_graduated || ""}
                            onChange={(e) => {
                              const newEdus = [...formData.educations];
                              newEdus[i].year_graduated = e.target.value;
                              setFormData((prev) => ({ ...prev, educations: newEdus }));
                            }}
                          />
                          {errors?.[`educations.${i}.year_graduated`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`educations.${i}.year_graduated`][0]}
                            </p>
                          )}
                        </div>

                        {i > 0 && (
                          <Button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                educations: prev.educations.filter((_, idx) => idx !== i),
                              }))
                            }
                            variant="destructive"
                            size="sm"
                          >
                            Remove <Trash />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {formData.role === "worker" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Certificates</span>
                      <Button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            certificates: [
                              ...prev.certificates,
                              { title: "", issuing_organization: "", date_issued: "", certificate_photo: null },
                            ],
                          }))
                        }
                        size="sm"
                      >
                        + Add Certificate
                      </Button>
                    </div>

                    {formData.certificates.map((cert, i) => (
                      <div key={i} className="grid md:grid-cols-4 gap-3 border p-3 rounded-lg">
                        {/* TITLE */}
                        <div>
                          <InputWithLabel
                            id={`cert_title_${i}`}
                            name="title"
                            type="text"
                            label="Title"
                            placeholder="Certificate title"
                            value={cert.title}
                            onChange={(e) => {
                              const newCerts = [...formData.certificates];
                              newCerts[i].title = e.target.value;
                              setFormData((prev) => ({ ...prev, certificates: newCerts }));
                            }}
                          />
                          {errors?.[`certificates.${i}.title`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`certificates.${i}.title`][0]}
                            </p>
                          )}
                        </div>

                        {/* ORGANIZATION */}
                        <div>
                          <InputWithLabel
                            id={`cert_org_${i}`}
                            name="issuing_organization"
                            type="text"
                            label="Issuing Organization"
                            placeholder="e.g., TESDA"
                            value={cert.issuing_organization || ""}
                            onChange={(e) => {
                              const newCerts = [...formData.certificates];
                              newCerts[i].issuing_organization = e.target.value;
                              setFormData((prev) => ({ ...prev, certificates: newCerts }));
                            }}
                          />
                          {errors?.[`certificates.${i}.issuing_organization`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`certificates.${i}.issuing_organization`][0]}
                            </p>
                          )}
                        </div>

                        {/* DATE ISSUED */}
                        <div>
                          <InputWithLabel
                            id={`cert_date_${i}`}
                            name="date_issued"
                            type="date"
                            label="Date Issued"
                            value={cert.date_issued || ""}
                            onChange={(e) => {
                              const newCerts = [...formData.certificates];
                              newCerts[i].date_issued = e.target.value;
                              setFormData((prev) => ({ ...prev, certificates: newCerts }));
                            }}
                          />
                          {errors?.[`certificates.${i}.date_issued`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`certificates.${i}.date_issued`][0]}
                            </p>
                          )}
                        </div>

                        {/* PHOTO UPLOAD */}
                        <div>
                          <Label>Certificate Photo</Label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null;
                              const newCerts = [...formData.certificates];
                              newCerts[i].certificate_photo = file;
                              setFormData((prev) => ({ ...prev, certificates: newCerts }));
                            }}
                          />
                          {errors?.[`certificates.${i}.certificate_photo`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`certificates.${i}.certificate_photo`][0]}
                            </p>
                          )}
                        </div>

                        {i > 0 && (
                          <Button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                certificates: prev.certificates.filter((_, idx) => idx !== i),
                              }))
                            }
                            variant="destructive"
                            size="sm"
                          >
                            Remove <Trash />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Employer Fields */}
                {formData.role === "employer" && (
                  <>
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="role">Employer Type</Label>
                      <Select value={formData.employer_type} onValueChange={(value) => {
                        setFormData((prev) => ({ 
                          ...prev, 
                          employer_type: value, 
                          business_name: "",
                          business_permit_photo: null,
                          bir_certificate_photo: null,
                        }));
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="establishment">Establishment</SelectItem>
                          <SelectItem value="household">Household</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors?.employer_type && <span className="text-destructive">{errors?.employer_type}</span>}
                    </div>

                    {formData.employer_type === "establishment" && <InputWithLabel
                      id="business_name"
                      name="business_name"
                      type="text"
                      label="Business Name"
                      placeholder="Enter your business name"
                      value={formData.business_name || ""}
                      onChange={handleChange}
                      disabled={loading}
                      error={errors?.business_name}
                    />}
                  </>
                )}

                {/* ===================== REQUIRED IMAGES ===================== */}
                <Separator />
                <div className="space-y-4">
                  <span className="text-lg font-semibold">Required Images</span>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-3">
                      <Label>Barangay Clearance</Label>
                      <input type="file" accept="image/*" name="barangay_clearance_photo" onChange={(e) => setFormData((p) => ({ ...p, barangay_clearance_photo: e.target.files?.[0] || null }))} />
                      {errors?.barangay_clearance_photo && <span className="text-destructive text-sm">{errors?.barangay_clearance_photo}</span>}
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Valid ID</Label>
                      <input type="file" accept="image/*" name="valid_id_photo" onChange={(e) => setFormData((p) => ({ ...p, valid_id_photo: e.target.files?.[0] || null }))} />
                      {errors?.valid_id_photo && <span className="text-destructive text-sm">{errors?.valid_id_photo}</span>}
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label>Selfie with ID</Label>
                      <input type="file" accept="image/*" name="selfie_with_id_photo" onChange={(e) => setFormData((p) => ({ ...p, selfie_with_id_photo: e.target.files?.[0] || null }))} />
                      {errors?.selfie_with_id_photo && <span className="text-destructive text-sm">{errors?.selfie_with_id_photo}</span>}
                    </div>
                    {formData.role === "employer" && formData.employer_type === "establishment" && (
                      <>
                        <div className="flex flex-col gap-3">
                          <Label>Business Permit</Label>
                          <input type="file" accept="image/*" name="business_permit_photo" onChange={(e) => setFormData((p) => ({ ...p, business_permit_photo: e.target.files?.[0] || null }))} />
                          {errors?.business_permit_photo && <span className="text-destructive text-sm">{errors?.business_permit_photo}</span>}
                        </div>
                        <div className="flex flex-col gap-3">
                          <Label>BIR Certificate</Label>
                          <input type="file" accept="image/*" name="bir_certificate_photo" onChange={(e) => setFormData((p) => ({ ...p, bir_certificate_photo: e.target.files?.[0] || null }))} />
                          {errors?.bir_certificate_photo && <span className="text-destructive text-sm">{errors?.bir_certificate_photo}</span>}
                        </div>
                      </>
                    )}
                  </div>
                </div>


              </div>

              {/* Submit */}
              <ButtonWithLoading
                type="submit"
                disabled={
                  loading 
                  // || !formData.first_name ||
                  // !formData.last_name ||
                  // !formData.email ||
                  // !formData.password ||
                  // !formData.password_confirmation ||
                  // !formData.location ||
                  // !formData.lat ||
                  // !formData.lng
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
