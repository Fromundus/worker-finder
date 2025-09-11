import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import InputWithLabel from "@/components/custom/InputWithLabel";
import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapSelectorDialog } from "@/components/custom/MapSelectorDialog";
import barangays from "@/data/barangays.json";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import AdminPage from "@/components/custom/AdminPage";

const ProfileUpdatePage = () => {
  const { user, token, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    contact_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    skills: "",
    experience: "",
    business_name: "",
    address: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        contact_number: user.contact_number || "",
        email: user.email || "",
        skills: user.skills || "",
        experience: user.experience || "",
        business_name: user.business_name || "",
        address: user.address || "",
        lat: user.lat || "",
        lng: user.lng || "",
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/profile", formData);

      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated.",
      });

      login(res.data.user, token); // update auth store with new user data
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Profile update failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPage withBackButton={true} title="Update Profile" description="Edit your personal information">
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputWithLabel
              id="name"
              name="name"
              type="text"
              label="Full Name"
              placeholder="Enter your name"
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

            {/* Password Update */}
            <InputWithLabel
              id="password"
              name="password"
              type="password"
              label="New Password"
              placeholder="Enter new password (optional)"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <InputWithLabel
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              label="Confirm Password"
              placeholder="Confirm new password"
              value={formData.password_confirmation}
              onChange={handleChange}
              disabled={loading}
            />

            {/* Worker-specific */}
            {user.role === "worker" && (
              <>
                <InputWithLabel
                  id="skills"
                  name="skills"
                  type="text"
                  label="Skills"
                  placeholder="Carpentry, Plumbing..."
                  value={formData.skills}
                  onChange={handleChange}
                  disabled={loading}
                />
                <InputWithLabel
                  id="experience"
                  name="experience"
                  type="text"
                  label="Experience"
                  placeholder="e.g. 5 years"
                  value={formData.experience}
                  onChange={handleChange}
                  disabled={loading}
                />
              </>
            )}

            {/* Employer-specific */}
            {user.role === "employer" && (
              <InputWithLabel
                id="business_name"
                name="business_name"
                type="text"
                label="Business Name"
                placeholder="Enter your business name"
                value={formData.business_name}
                onChange={handleChange}
                disabled={loading}
              />
            )}

            {/* Address Select */}
            <div className="flex flex-col gap-3">
              <Label htmlFor="address">Address (Barangay)</Label>
              <Select
                value={formData.address}
                onValueChange={(value) => {
                  const barangay = barangays.find((b) => `${b.name}, ${b.municipality}` === value);
                  setFormData((prev: any) => ({
                    ...prev,
                    address: value,
                    lat: barangay?.lat.toString() || "",
                    lng: barangay?.lng.toString() || "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Barangay" />
                </SelectTrigger>
                <SelectContent>
                  {barangays.map((b) => (
                    <SelectItem key={`${b.name}, ${b.municipality}`} value={`${b.name}, ${b.municipality}`}>
                      {b.name}, {b.municipality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Map Selector */}
            <div className="flex flex-col gap-3">
              <Label>Exact Location</Label>
              <MapSelectorDialog
                lat={formData.lat}
                lng={formData.lng}
                onSelect={(lat, lng) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    lat,
                    lng,
                  }))
                }
              />
              <div className="text-sm text-muted-foreground">
                {formData.lat && formData.lng
                  ? `Selected: Lat ${formData.lat}, Lng ${formData.lng}`
                  : "No location selected"}
              </div>
            </div>

            <ButtonWithLoading
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              Save Changes
            </ButtonWithLoading>
          </form>
        </CardContent>
      </Card>
    </AdminPage>
  );
};

export default ProfileUpdatePage;
