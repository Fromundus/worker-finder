// import AdminPageMain from '@/components/custom/AdminPageMain'
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Building, Clock, DollarSign, MapPin, MessageSquare } from 'lucide-react';

// import React from 'react'

// const WorkerApplications = () => {
//   return (
//     <AdminPageMain title='My Applications' description='Track your job application status'>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="shadow-soft">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Pending</p>
//                 <p className="text-2xl font-bold text-warning">{pendingCount}</p>
//               </div>
//               <Clock className="h-8 w-8 text-warning" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-soft">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Accepted</p>
//                 <p className="text-2xl font-bold text-success">{acceptedCount}</p>
//               </div>
//               <Clock className="h-8 w-8 text-success" />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="shadow-soft">
//           <CardContent className="p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">Rejected</p>
//                 <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
//               </div>
//               <Clock className="h-8 w-8 text-destructive" />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Applications List */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold">All Applications ({myApplications.length})</h2>

//         <div className="grid grid-cols-1 gap-4">
//           {myApplications.map((application) => {
//             const job = getJobPostById(application.job_post_id);
//             const employer = getUserById(job?.user_id || '');
//             const location = getLocationById(job?.location_id || '');
            
//             return (
//               <Card key={application.id} className="shadow-soft hover:shadow-medium transition-smooth">
//                 <CardHeader>
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <CardTitle className="text-lg">{job?.title}</CardTitle>
//                       <CardDescription className="flex items-center gap-2 mt-1">
//                         <Building className="h-4 w-4" />
//                         {employer?.business_name || employer?.name}
//                       </CardDescription>
//                     </div>
//                     <Badge variant={application.status as any}>
//                       {application.status}
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
//                     <div className="flex items-center gap-1">
//                       <MapPin className="h-4 w-4" />
//                       {location?.barangay}, {location?.municipality}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Clock className="h-4 w-4" />
//                       {job?.job_type}
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <DollarSign className="h-4 w-4" />
//                       ₱{job?.salary}/day
//                     </div>
//                   </div>

//                   <div className="bg-muted/50 p-3 rounded-lg">
//                     <div className="flex items-start gap-2">
//                       <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
//                       <div className="flex-1">
//                         <p className="text-sm font-medium">Your Message:</p>
//                         <p className="text-sm text-muted-foreground mt-1">{application.message}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between text-xs text-muted-foreground">
//                     <span>Applied {new Date(application.applied_at).toLocaleDateString()}</span>
//                     <span>Job posted {job ? new Date(job.created_at).toLocaleDateString() : ''}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {myApplications.length === 0 && (
//           <Card className="shadow-soft">
//             <CardContent className="p-8 text-center">
//               <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">No applications yet</h3>
//               <p className="text-muted-foreground">Start applying to jobs to see them here</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </AdminPageMain>
//   )
// }

// export default WorkerApplications

import React, { useEffect, useState } from "react";
import AdminPageMain from "@/components/custom/AdminPageMain";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";

const WorkerApplications = () => {
  const { user,  } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get("/my-applications");
        setApplications(res.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Counts
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;

  return (
    <AdminPageMain
      title="My Applications"
      description="Track your job application status"
    >
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold text-green-500">{acceptedCount}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
              </div>
              <Clock className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold">
          All Applications ({applications.length})
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {applications.map((application) => {
            const job = application.job_post;
            const employer = job?.user;
            const location = job?.location;

            return (
              <Card
                key={application.id}
                className="shadow-soft hover:shadow-medium transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job?.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Building className="h-4 w-4" />
                        {employer?.business_name || employer?.name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{application.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {location.barangay}, {location.municipality}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job?.job_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      ₱{job?.salary}/day
                    </div>
                  </div>

                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Your Message:</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {application.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Applied {new Date(application.created_at).toLocaleDateString()}
                    </span>
                    <span>
                      Job posted{" "}
                      {job ? new Date(job.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!loading && applications.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No applications yet</h3>
              <p className="text-muted-foreground">
                Start applying to jobs to see them here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageMain>
  );
};

export default WorkerApplications;
