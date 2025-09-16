import AdminPageMain from "@/components/custom/AdminPageMain";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, PenBox, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { Link, useParams } from "react-router-dom";

const AdminProfilePage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);

  let url = "";

  if (id) {
    url = `/user-profile/${id}`;
  } else {
    url = "/profile";
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(res.data.user);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [token]);

  if (!profile) {
    return (
      <AdminPageMain
        title={id ? "Admin Profile" : "My Profile"}
        description={id ? "Administrator Profile Information" : "Manage your profile information"}
      >
        <p className="text-muted-foreground">Loading...</p>
      </AdminPageMain>
    );
  }

  return (
    <AdminPageMain
      title={id ? "Admin Profile" : "My Profile"}
      description={id ? "Administrator Profile Information" : "Manage your profile information"}
      topAction={
        <>
          {!id && (
            <Link to={"update"}>
              <Button>
                <PenBox /> Update
              </Button>
            </Link>
          )}
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2 shadow-medium">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            {!id && (
              <CardDescription>Your personal details and login information</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  {profile.name}
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-xs">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{profile.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageMain>
  );
};

export default AdminProfilePage;
