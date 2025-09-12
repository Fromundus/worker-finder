// import AdminPageMain from '@/components/custom/AdminPageMain'
// import React from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Award, Briefcase, Clock, Mail, Phone, Star, User } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';

// const ProfilePage = () => {
//     return (
//         <AdminPageMain title='My Profile' description='Manage your profile information'>
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Basic Information */}
//                 <Card className="lg:col-span-2 shadow-medium">
//                     <CardHeader>
//                     <CardTitle>Basic Information</CardTitle>
//                     <CardDescription>Your personal details and contact information</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-6">
//                     <div className="flex items-center gap-4">
//                         <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
//                         <User className="h-8 w-8 text-primary" />
//                         </div>
//                         <div className="flex-1">
//                         <h2 className="text-2xl font-bold">{worker.name}</h2>
//                         <Badge variant={worker.status as any}>
//                             {worker.status}
//                         </Badge>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="flex items-center gap-3">
//                         <Phone className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                             <p className="text-sm text-muted-foreground">Phone</p>
//                             <p className="font-medium">{worker.contact_number}</p>
//                         </div>
//                         </div>
//                         <div className="flex items-center gap-3">
//                         <Mail className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                             <p className="text-sm text-muted-foreground">Email</p>
//                             <p className="font-medium">{worker.email}</p>
//                         </div>
//                         </div>
//                     </div>

//                     <div>
//                         <div className="flex items-center gap-3 mb-3">
//                         <Briefcase className="h-4 w-4 text-muted-foreground" />
//                         <p className="text-sm text-muted-foreground">Skills</p>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                         {worker.skills?.map((skill, index) => (
//                             <Badge key={index} variant="primary">
//                             {skill}
//                             </Badge>
//                         )) || <p className="text-muted-foreground text-sm">No skills listed</p>}
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         <Clock className="h-4 w-4 text-muted-foreground" />
//                         <div>
//                         <p className="text-sm text-muted-foreground">Experience</p>
//                         <p className="font-medium">{worker.experience || 0} years</p>
//                         </div>
//                     </div>
//                     </CardContent>
//                 </Card>

//                 {/* Stats */}
//                 <div className="space-y-4">
//                     <Card className="shadow-soft">
//                     <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                         <Star className="h-8 w-8 text-yellow-500" />
//                         <div>
//                             <p className="text-2xl font-bold">{worker.average_rating || 0}/5</p>
//                             <p className="text-sm text-muted-foreground">Average Rating</p>
//                         </div>
//                         </div>
//                     </CardContent>
//                     </Card>

//                     <Card className="shadow-soft">
//                     <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                         <Award className="h-8 w-8 text-success" />
//                         <div>
//                             <p className="text-2xl font-bold">{completedJobs}</p>
//                             <p className="text-sm text-muted-foreground">Completed Jobs</p>
//                         </div>
//                         </div>
//                     </CardContent>
//                     </Card>

//                     <Card className="shadow-soft">
//                     <CardContent className="p-4">
//                         <div className="flex items-center gap-3">
//                         <Briefcase className="h-8 w-8 text-primary" />
//                         <div>
//                             <p className="text-2xl font-bold">{totalApplications}</p>
//                             <p className="text-sm text-muted-foreground">Total Applications</p>
//                         </div>
//                         </div>
//                     </CardContent>
//                     </Card>
//                 </div>
//                 </div>

//                 {/* Recent Feedback */}
//                 {myFeedback.length > 0 && (
//                 <Card className="shadow-medium">
//                     <CardHeader>
//                     <CardTitle>Recent Feedback</CardTitle>
//                     <CardDescription>What employers say about your work</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                     {myFeedback.slice(0, 3).map((feedback) => {
//                         const employer = getUserById(feedback.from_user_id);
//                         return (
//                         <div key={feedback.id} className="border rounded-lg p-4">
//                             <div className="flex items-center justify-between mb-2">
//                             <p className="font-medium">{employer?.business_name || employer?.name}</p>
//                             <div className="flex items-center gap-1">
//                                 {[1, 2, 3, 4, 5].map((i) => (
//                                 <Star
//                                     key={i}
//                                     className={`h-4 w-4 ${
//                                     i <= feedback.rating
//                                         ? "text-yellow-500 fill-current"
//                                         : "text-muted-foreground"
//                                     }`}
//                                 />
//                                 ))}
//                             </div>
//                             </div>
//                             <p className="text-sm text-muted-foreground">{feedback.comment}</p>
//                             <p className="text-xs text-muted-foreground mt-2">
//                             {new Date(feedback.created_at).toLocaleDateString()}
//                             </p>
//                         </div>
//                         );
//                     })}
//                     {myFeedback.length > 3 && (
//                         <Button variant="ghost" className="w-full">
//                         View All Feedback
//                         </Button>
//                     )}
//                     </CardContent>
//                 </Card>
//             )}
//         </AdminPageMain>
//     )
// }

// export default ProfilePage

import AdminPageMain from "@/components/custom/AdminPageMain";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Briefcase, Clock, Mail, PenBox, Phone, Star, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [myFeedback, setMyFeedback] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalJobPosts, setTotalJobPosts] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res);

        setProfile(res.data.user);
        setCompletedJobs(res.data.completedJobs);
        setTotalApplications(res.data.totalApplications);
        setMyFeedback(res.data.feedback);
        setAverageRating(res.data.averageRating);
        setTotalJobPosts(res.data.totalJobPosts);
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
      <AdminPageMain title="My Profile" description="Manage your profile information">
        <p className="text-muted-foreground">Loading...</p>
      </AdminPageMain>
    );
  }

  return (
    <AdminPageMain
      title="My Profile"
      description="Manage your profile information"
      topAction={
        <Link to={'update'}>
            <Button>
                <PenBox /> Update
            </Button>
        </Link>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="lg:col-span-2 shadow-medium">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              {/* <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div> */}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Name</p>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <Badge variant={profile.status as any}>
                  {profile.status}
                </Badge>
              </div>
            </div>

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
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{profile.experience || "N/A"}</p>
                  </div>
                </div>
              </>
            )}

            {/* Employer-specific fields */}
            {profile.role === "employer" && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Business</p>
                  <p className="font-medium">{profile.business_name || "N/A"}</p>
                </div>
              </div>
            )}
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

          {user.role === "worker" && <>
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

          {user.role === "employer" && <Card className="shadow-soft">
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

              return (
                <div key={feedback.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">
                      {counterpart?.business_name || counterpart?.name}
                    </p>
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
            {myFeedback.length > 3 && (
              <Link to={`/${user.role}/feedbacks`}>
                <Button variant="ghost" className="w-full">
                  View All Feedback
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </AdminPageMain>
  );
};

export default ProfilePage;
