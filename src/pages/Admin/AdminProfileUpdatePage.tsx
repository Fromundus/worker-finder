import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputWithLabel from "@/components/custom/InputWithLabel";
import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import AdminPage from "@/components/custom/AdminPage";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminProfileUpdatePage = () => {
  const { user, token, login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "admin",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email || "",
        password: "",
        password_confirmation: "",
        role: user.role || "admin",
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

      login(res.data.user, token);
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
    <AdminPage
      withBackButton={true}
      title="Update Profile"
      description="Edit your admin profile information"
    >
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Edit Admin Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
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

export default AdminProfileUpdatePage;
