// import AdminPageMain from '@/components/custom/AdminPageMain'
// import React from 'react'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Briefcase, Building, MessageSquare, Star } from 'lucide-react';

// const Feedbacks = () => {
//   return (
//     <AdminPageMain title='Feedbacks' description=''>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="shadow-medium">
//             <CardHeader>
//               <CardTitle>Overall Rating</CardTitle>
//               <CardDescription>Your average rating from employers</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center gap-4">
//                 <div className="text-4xl font-bold text-primary">{averageRating}</div>
//                 <div className="flex">
//                   {[1, 2, 3, 4, 5].map((i) => (
//                     <Star
//                       key={i}
//                       className={`h-6 w-6 ${
//                         i <= Math.round(Number(averageRating))
//                           ? "text-yellow-500 fill-current"
//                           : "text-muted-foreground"
//                       }`}
//                     />
//                   ))}
//                 </div>
//                 <div className="text-sm text-muted-foreground">
//                   Based on {myFeedback.length} reviews
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="shadow-medium">
//             <CardHeader>
//               <CardTitle>Rating Distribution</CardTitle>
//               <CardDescription>Breakdown of your ratings</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               {[5, 4, 3, 2, 1].map((rating) => (
//                 <div key={rating} className="flex items-center gap-3">
//                   <div className="flex items-center gap-1 w-12">
//                     <Star className="h-4 w-4 text-yellow-500" />
//                     <span className="text-sm">{rating}</span>
//                   </div>
//                   <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
//                     <div
//                       className="h-full bg-primary rounded-full transition-all"
//                       style={{
//                         width: myFeedback.length > 0 ? `${(ratingCounts[rating] / myFeedback.length) * 100}%` : '0%'
//                       }}
//                     />
//                   </div>
//                   <span className="text-sm text-muted-foreground w-8">{ratingCounts[rating]}</span>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Feedback List */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold">All Feedback ({myFeedback.length})</h2>

//           <div className="grid grid-cols-1 gap-4">
//             {myFeedback.map((feedback) => {
//               const employer = getUserById(feedback.from_user_id);
//               const job = getJobPostById(feedback.job_post_id);
              
//               return (
//                 <Card key={feedback.id} className="shadow-soft hover:shadow-medium transition-smooth">
//                   <CardHeader>
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2">
//                           <Building className="h-4 w-4 text-muted-foreground" />
//                           <CardTitle className="text-lg">{employer?.business_name || employer?.name}</CardTitle>
//                         </div>
//                         <CardDescription className="flex items-center gap-2 mt-1">
//                           <Briefcase className="h-4 w-4" />
//                           {job?.title}
//                         </CardDescription>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <div className="flex">
//                           {[1, 2, 3, 4, 5].map((i) => (
//                             <Star
//                               key={i}
//                               className={`h-4 w-4 ${
//                                 i <= feedback.rating
//                                   ? "text-yellow-500 fill-current"
//                                   : "text-muted-foreground"
//                               }`}
//                             />
//                           ))}
//                         </div>
//                         <span className="text-sm font-medium ml-1">{feedback.rating}/5</span>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="bg-muted/50 p-4 rounded-lg">
//                       <div className="flex items-start gap-2">
//                         <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
//                         <p className="text-sm flex-1">{feedback.comment}</p>
//                       </div>
//                     </div>
//                     <p className="text-xs text-muted-foreground mt-3">
//                       {new Date(feedback.created_at).toLocaleDateString()}
//                     </p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>

//           {myFeedback.length === 0 && (
//             <Card className="shadow-soft">
//               <CardContent className="p-8 text-center">
//                 <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-medium mb-2">No feedback yet</h3>
//                 <p className="text-muted-foreground">Complete jobs to receive feedback from employers</p>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//     </AdminPageMain>
//   )
// }

// export default Feedbacks

import AdminPageMain from "@/components/custom/AdminPageMain";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building, MessageSquare, Star, User } from "lucide-react";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";

const Feedbacks = () => {
  const { user } = useAuth();
  const [myFeedback, setMyFeedback] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/feedbacks");
        console.log(res);
        setMyFeedback(res.data.feedback);
        setAverageRating(res.data.averageRating || 0);
        setRatingCounts(res.data.ratingCounts || {});
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load feedback",
          variant: "destructive",
        });
      }
    };

    fetchFeedback();
  }, []);

  return (
    <AdminPageMain
      title="Feedbacks"
      description={user.role === "worker" ? "What employers say about your work" : "What workers say about you"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Rating */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Overall Rating</CardTitle>
            <CardDescription>
              {user.role === "worker"
                ? "Your average rating from employers"
                : "Your average rating from workers"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">{averageRating}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i <= Math.round(Number(averageRating))
                        ? "text-yellow-500 fill-current"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                Based on {myFeedback.length} reviews
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>Breakdown of your ratings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{rating}</span>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width:
                        myFeedback.length > 0
                          ? `${((ratingCounts[rating] || 0) / myFeedback.length) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-8">
                  {ratingCounts[rating] || 0}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Feedback List */}
      <div className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold">All Feedback ({myFeedback.length})</h2>

        <div className="grid grid-cols-1 gap-4">
          {myFeedback.map((feedback) => {
            const counterpart =
              user.role === "worker" ? feedback.from_user : feedback.to_user;
            const job = feedback.job_post;

            return (
              <Card key={feedback.id} className="shadow-soft hover:shadow-medium transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {user.role === "worker" ? (
                          <Building className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
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
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="flex">
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
                      <span className="text-sm font-medium ml-1">
                        {feedback.rating}/5
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p className="text-sm flex-1">{feedback.comment}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {myFeedback.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No feedback yet</h3>
              <p className="text-muted-foreground">
                {user.role === "worker"
                  ? "Complete jobs to receive feedback from employers"
                  : "Hire workers to receive feedback from them"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageMain>
  );
};

export default Feedbacks;
