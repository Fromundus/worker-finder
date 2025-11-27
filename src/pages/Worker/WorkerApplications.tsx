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
  Users,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import { toast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MessageButton from "@/components/MessageButton";
import Modal from "@/components/custom/Modal";
import ViewMap from "@/components/custom/ViewMap";

const WorkerApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

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

  useEffect(() => {
    fetchApplications();
  }, []);


  const handleAddFeedback = (application: any) => {
    setSelectedApplication(application);
    setRating(0);
    setComment("");
    setIsFeedbackDialogOpen(true);
  };

  console.log(selectedApplication);

  // --- submit feedback ---
  const handleSubmitFeedback = async () => {
    if (!selectedApplication) return;
    try {
      console.log(selectedApplication);

      await api.post(`/feedbacks/${selectedApplication.id}`, {
        to_user_id: selectedApplication.job_post.user_id,
        job_post_id: selectedApplication.job_post_id,
        rating,
        comment,
      });
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been saved.",
      });
      setIsFeedbackDialogOpen(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };

  // Counts
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const forInterviewCount = applications.filter((a) => a.status === "forinterview").length;
  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const activeCount = applications.filter((a) => a.status === "active").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;
  const withdrawnCount = applications.filter((a) => a.status === "withdrawn").length;
  const completedCount = applications.filter((a) => a.status === "completed").length;

  const ApplicationCard = ({ application }: { application: any }) => {
    const job = application.job_post;
    const employer = job?.user;
    const location = job?.location;

    const [locationModal, setLocationModal] = useState(false);

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
                {employer?.business_name || `${job.user?.first_name} ${job.user?.middle_name} ${job.user?.last_name} ${job.user?.suffix ? job.user?.suffix : ""}`}
              </CardDescription>
            </div>
            <Badge
              className={`text-white
                ${application.status === "pending" && "bg-orange-500"}
                ${application.status === "forinterview" && "bg-blue-500"}
                ${application.status === "accepted" && "bg-green-500"}
                ${application.status === "active" && "bg-green-500"}
                ${application.status === "rejected" && "bg-red-500"}
                ${application.status === "withdrawn" && "bg-gray-500"}
                ${application.status === "completed" && "bg-primary text-black"}
              `}
            >
              {application.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <MessageButton userId={employer.id} />
          <p className="text-sm text-muted-foreground">{job.description}</p>
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

          {application.status === "forinterview" && <div className="flex flex-col gap-1">
            <span>Interview Details</span>
            <div className="space-y-2 text-sm text-muted-foreground flex flex-col">
              <span>Date: {application.interview_date}</span>
              <span>Location: {application.interview_location}</span>
              <Modal open={locationModal} setOpen={setLocationModal} buttonClassName="w-fit h-9" title="Exact Location" buttonLabel={
                "View Interview Location"
              }> 
                <>
                  <ViewMap lat={application.lat} lng={application.lng} />
                </>
              </Modal>
            </div>
          </div>}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Applied {new Date(application.created_at).toLocaleDateString()}
            </span>
            <span>
              Job posted{" "}
              {job ? new Date(job.created_at).toLocaleDateString() : ""}
            </span>
          </div>

          {(application.status === "completed" && !application.employerIsRated) && <Button className='bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white' disabled={loading} size="sm" variant="outline" onClick={() => handleAddFeedback(application)}>
            {/* <Star className="h-4 w-4" /> Rate */}
            Give Feedback
          </Button>}
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminPageMain
      title="My Applications"
      description="Track your job application status"
    >
      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">For Interview</p>
              <p className="text-2xl font-bold text-blue-500">{forInterviewCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Accepted</p>
              <p className="text-2xl font-bold text-green-500">{acceptedCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Withdrawn</p>
              <p className="text-2xl font-bold text-gray-500">{withdrawnCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-primary">{completedCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold">Your Applications ({applications.length})</h2>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="forinterview">For Interview ({forInterviewCount})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedCount})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
          <TabsTrigger value="withdrawn">Withdrawn ({withdrawnCount})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
        </TabsList>

        {["all", "pending", "forinterview", "accepted", "active", "rejected", "withdrawn", "completed"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {(tab === "all"
                ? applications
                : applications.filter((a) => a.status === tab)
              ).map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>

            {(tab === "all"
              ? applications
              : applications.filter((a) => a.status === tab)
            ).length === 0 && !loading && (
              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No {tab} applications</h3>
                  <p className="text-muted-foreground">
                    Nothing here yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Give Feedback to Employer</DialogTitle>
            <DialogDescription>
              {/* Provide a feedback for{" "} */}
              {/* <span className="font-medium">{selectedApplication?.user?.first_name}</span> */}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rating Stars */}
            {/* <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 ${
                    rating >= star ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  <Star className="h-12 w-12 fill-current" />
                </button>
              ))}
            </div> */}

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Feedback</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your feedback..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={!comment}
                onClick={handleSubmitFeedback}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageMain>
  );
};

export default WorkerApplications;
