import AdminPageMain from "@/components/custom/AdminPageMain";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Briefcase, Building, Clock, Glasses, Mail, PenBox, Phone, Star, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { Link, useParams } from "react-router-dom";
import ProfileStatusBadge from "@/components/custom/ProfileStatusBadge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import MessageButton from "@/components/MessageButton";
import User from "@/types/User";
import ipconfig from "@/ipconfig";

const ProfilePage = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<User>(null);
  const [myFeedback, setMyFeedback] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalJobPosts, setTotalJobPosts] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);

  const [bookingDialogOpen, setBookingDialogOpen] = React.useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = React.useState<number | null>(null);
  const [bookingData, setBookingData] = React.useState({
    job_title: "",
    description: "",
    salary: 0,
  });

  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);


  const handleChangeBookingData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setBookingData((prev) => {
      return {
        ...prev,
        [name]: value,
      }
    });
  }

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

  let url = "";

  if(id){
    url = `/user-profile/${id}`
  } else {
    url = "/profile"
  }

  const fetchProfile = async () => {
    try {
      const res = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(res);

      setProfile(res.data.user);
      setCompletedJobs(res.data.completedJobs);
      setTotalApplications(res.data.totalApplications);
      setMyFeedback(res.data.feedback);
      setAverageRating(res.data.averageRating);
      setTotalJobPosts(res.data.totalJobPosts);
      setTotalBookings(res.data.totalBookings);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {

    fetchProfile();
  }, [token]);

  const openBookingDialog = (workerId: number) => {
    setSelectedWorkerId(workerId);
    setBookingData({
      job_title: "",
      description: "",
      salary: 0,
    });
    setBookingDialogOpen(true);
  };

  if (!profile) {
    return (
      <AdminPageMain title={id ? "Profile" : "My Profile"} description={id ? "User Profile Information" : "Manage your profile information"}>
        <p className="text-muted-foreground">Loading...</p>
      </AdminPageMain>
    );
  }

  const updateStatus = async (ids: number[], status: string) => {
    if (!ids.length) return;
    setLoading(true);

    const data = {
      ids: ids,
      status: status,
    }

    try {
      await api.put("/update-status", data);

      toast({
        title: "Updated Successfully",
      });
      
      setSelected([]);
      fetchProfile();
    } catch (err) {
      console.log(err);
      toast({
        title: err.response.status,
        description: err.response.data.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <AdminPageMain
      title={id ? "Profile" : "My Profile"}
      description={id ? "User Profile Information" : "Manage your profile information"}
      topAction={
        <>
          {!id && <Link to={'update'}>
              <Button>
                  <PenBox /> Update
              </Button>
          </Link>}

          {id && profile.role === "worker" && user.role === "employer" && <Button
            className="bg-blue-500 text-white hover:bg-blue-700"
            disabled={profile.status !== "active"}
            onClick={() => openBookingDialog(profile.id)}
          >
            Book Worker
          </Button>}
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2 shadow-medium">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            {!id && <CardDescription>Your personal details and contact information</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">
                    {profile.first_name} {profile.middle_name} {profile.last_name} {profile.suffix}
                  </h2>
                  <ProfileStatusBadge status={profile.status} />
                </div>
              </div>
            </div>

            {/* 🆕 Birthdate and Age */}
            {profile.birth_day && (
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Birthdate</p>
                  <p className="font-medium">
                    {new Date(profile.birth_day).toLocaleDateString()} (
                    {(() => {
                      const birth = new Date(profile.birth_day);
                      const ageDifMs = Date.now() - birth.getTime();
                      const ageDate = new Date(ageDifMs);
                      return Math.abs(ageDate.getUTCFullYear() - 1970);
                    })()}{" "}
                    years old)
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{profile.contact_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-xs">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* 🆕 Additional personal details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Sex</p>
                <p className="font-medium">{profile.sex}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Religion</p>
                <p className="font-medium">{profile.religion}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Civil Status</p>
                <p className="font-medium">{profile.civil_status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Height</p>
                <p className="font-medium">{profile.height} cm</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <Glasses className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Disabilities</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.disabilities
                  ? profile.disabilities.split(",").map((skill: string, i: number) => (
                      <Badge key={i} variant="default">
                        {skill.trim()}
                      </Badge>
                    ))
                  : <p className="text-muted-foreground text-sm">No disabilities listed</p>}
              </div>
              {profile.disability_specify && <div className="mt-2">
                <p className="text-sm text-muted-foreground">Specific Disability</p>
                <Badge variant="default">
                  {profile?.disability_specify}
                </Badge>
              </div>}
            </div>

            {/* Worker-specific fields */}
            {profile.role === "worker" && (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Skills</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills
                      ? profile.skills.split(",").map((skill: string, i: number) => (
                          <Badge key={i} variant="default">
                            {skill.trim()}
                          </Badge>
                        ))
                      : <p className="text-muted-foreground text-sm">No skills listed</p>}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Specific Skill</p>
                    <Badge variant="default">
                      {profile?.skill_specify}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{profile.experience || "N/A"}</p>
                  </div>
                </div>

                {/* 🆕 Educations */}
                {profile.educations?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" /> Education
                    </p>
                    <div className="space-y-2">
                      {profile.educations.map((edu, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <p className="font-semibold">{edu.level}</p>
                          <p className="text-sm">{edu.school_name}</p>
                          {edu.course && <p className="text-sm text-muted-foreground">{edu.course}</p>}
                          {edu.year_graduated && (
                            <p className="text-xs text-muted-foreground">Year Graduated: {edu.year_graduated}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 🆕 Certificates */}
                {profile.certificates?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" /> Certificates
                    </p>
                    <div className="grid md:grid-cols-1 gap-3">
                      {profile.certificates.map((cert, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <p className="font-semibold">{cert.title}</p>
                          <p className="text-sm text-muted-foreground">{cert.issuing_organization}</p>
                          {cert.date_issued && (
                            <p className="text-xs text-muted-foreground">
                              Issued: {new Date(cert.date_issued).toLocaleDateString()}
                            </p>
                          )}
                          {cert.certificate_photo && (
                            <img
                              src={`${ipconfig}/api/files/${cert.certificate_photo}`}
                              alt={cert.title}
                              className="mt-2 rounded-md border w-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Employer-specific fields */}
            {profile.role === "employer" && (
              <>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Employer Type</p>
                    <p className="font-medium capitalize"><Badge>{profile.employer_type}</Badge></p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Business</p>
                    <p className="font-medium">{profile.business_name || "N/A"}</p>
                  </div>
                </div>
              </>
            )}

            {/* 🆕 Uploaded Images Section */}
            <div className="mt-6">
              <p className="text-lg font-semibold mb-2">Uploaded Documents</p>
              <div className="grid md:grid-cols-1 gap-4">
                {[
                  { label: "Barangay Clearance", field: "barangay_clearance_photo" },
                  { label: "Valid ID", field: "valid_id_photo" },
                  { label: "Selfie with ID", field: "selfie_with_id_photo" },
                  { label: "Business Permit", field: "business_permit_photo" },
                  { label: "BIR Certificate", field: "bir_certificate_photo" },
                ].map(({ label, field }) => (
                  profile[field] && (
                    <div key={field}>
                      <p className="text-muted-foreground mb-1">{label}</p>
                      <img
                        src={`${ipconfig}/api/files/${profile[field]}`}
                        alt={label}
                        className="rounded-md border object-cover"
                      />
                    </div>
                  )
                ))}
              </div>
            </div>

            {((user.id !== profile.id) && user.role !== "admin") && <MessageButton userId={profile.id} />}
          </CardContent>
        </Card>


        {/* Stats */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{averageRating || 0}/5</p>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {((user.role === "worker" && !id) || (profile.role === "worker" && id)) && <>
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-2xl font-bold">{completedJobs}</p>
                    <p className="text-sm text-muted-foreground">Completed Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{totalApplications}</p>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>}

          {((user.role === "employer" && !id) || (profile.role === "employer" && id)) && <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-success" />
                <div>
                  <p className="text-2xl font-bold">{totalJobPosts || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Job Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>}

          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{totalBookings}</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Feedback */}
      {myFeedback.length > 0 && (
        <Card className="shadow-medium mt-6">
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>
              {profile.role === "worker"
                ? "What employers say about your work"
                : "What workers say about you"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {myFeedback.slice(0, 3).map((feedback) => {
              const counterpart =
                profile.role === "worker" ? feedback.from_user : feedback.to_user;
                const job = feedback.job_post;
                const booking = feedback.booking;

              return (
                <div key={feedback.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {profile.role === "worker" ? (
                          <Building className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        )}
                        <CardTitle className="text-lg">
                          {feedback.from_user.name}
                        </CardTitle>
                      </div>
                      {job && (
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Briefcase className="h-4 w-4" />
                          {job.title}
                        </CardDescription>
                      )}
                      {booking && (
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Briefcase className="h-4 w-4" />
                          {booking.job_title}
                        </CardDescription>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i <= feedback.rating
                              ? "text-yellow-500 fill-current"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
            {myFeedback.length > 3 && !id && (
              <Link to={`/${user.role}/feedbacks`}>
                <Button variant="ghost" className="w-full">
                  View All Feedback
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

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
      {(user.role === "admin" && (profile.status === "pending" || profile.status === "inactive")) && <div className="flex justify-end gap-2">
        <Button onClick={() => updateStatus([profile.id], "active")}>
          Verify/Activate
        </Button>
      </div>}
      {(user.role === "admin" && (profile.status === "active")) && <div className="flex justify-end gap-2">
        <Button variant="destructive" onClick={() => updateStatus([profile.id], "inactive")}>
          Deactivate
        </Button>
      </div>}
    </AdminPageMain>
  );
};

export default ProfilePage;
