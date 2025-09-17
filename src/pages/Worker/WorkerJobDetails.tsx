import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Clock, DollarSign, MapPin, Star, User } from "lucide-react";
import api from "@/api/axios";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/store/auth";
import AdminPage from "@/components/custom/AdminPage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import MessageButton from "@/components/MessageButton";

const WorkerJobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
    const [loading, setLoading] = React.useState(false);
  

  const [job, setJob] = useState<any>(null);

    const [open, setOpen] = useState(false);
    const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
    const [message, setMessage] = useState("");

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/job-posts/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load job details.",
        variant: "destructive",
      });
    }
  };

    const handleOpenApply = (jobId: number) => {
        setSelectedJobId(jobId);
        setMessage("");
        setOpen(true);
    };

      const handleApplyToJob = async () => {
        if (!selectedJobId) return;
    
        setLoading(true);
    
        try {
          await api.post("/applications", {
            job_post_id: selectedJobId,
            user_id: user.id,
            status: "pending",
            message,
          });

          fetchJob();

          setOpen(false);
    
          toast({
            title: "Application Submitted!",
            description: "Your application has been sent to the employer.",
          });
          setLoading(false);
        } catch (err) {
          console.error(err);
          toast({
            title: "Error",
            description: err.response.data.message,
            variant: "destructive",
          });
          setLoading(false);
        }
      };

  if (!job) {
    return <p className="text-center text-muted-foreground">Loading...</p>;
  }

  const isApplied = job.applications?.some((a: any) => a.user_id === user?.id);

  return (
    <AdminPage title="Job Details" withBackButton={true} description="View job details.">
        <div className="w-full">
        <Card className="shadow-soft">
            <CardHeader>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <CardDescription className="flex flex-col gap-2 mt-2">
                    <span className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {job.user?.business_name || job.user?.name}
                    </span>
                    <span className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {job.user?.average_rating ?? "No rating yet"}
                    </span>
                </CardDescription>
                </div>
                <Badge
                className={`text-white
                    ${job.status === "open" && "bg-green-500 hover:bg-green-600"}  
                    ${job.status === "paused" && "bg-orange-500 hover:bg-orange-600"}  
                    ${job.status === "filled" && "bg-blue-500 hover:bg-blue-600"}  
                    ${job.status === "closed" && "bg-red-500 hover:bg-red-600"}  
                `}
                >
                {job.status}
                </Badge>
            </div>
            </CardHeader>

            <CardContent className="space-y-6">
            {/* Job Details */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Job Details</h2>
                <p className="text-sm text-muted-foreground">{job.description}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {job.location && (
                    <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {job.location.barangay}, {job.location.municipality}
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {job.job_type}
                </div>
                <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ₱{job.salary}/day
                </div>
                </div>
            </section>

            {/* Employer Details */}
            <section>
                <h2 className="font-semibold text-lg mb-2">Employer</h2>
                <div className="flex items-center gap-3 text-sm">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="font-medium">{job.user?.name}</p>
                    <p className="text-muted-foreground">{job.user?.email}</p>
                </div>
                </div>
            </section>

            {/* Posted Info */}
            <section>
                <p className="text-xs text-muted-foreground">
                Posted on {new Date(job.created_at).toLocaleDateString()}
                </p>
            </section>

            {/* Apply Button */}
            <div className="flex justify-end gap-2">
                <MessageButton userId={job.user.id} />
                <Link to={`/${user.role}/profile/${job.user.id}`}>
                    <Button variant="outline">
                        View Employer Profile
                    </Button>
                </Link>
                <Button
                    variant={isApplied ? "secondary" : "default"}
                    disabled={isApplied}
                    onClick={() => user ? handleOpenApply(job.id) : navigate('/login')}
                >
                    {isApplied ? "Applied" : "Apply Now"}
                </Button>
            </div>
            </CardContent>
        </Card>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Apply to Job</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                <Textarea
                    placeholder="Write a message to the employer..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                />
                </div>
                <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <ButtonWithLoading loading={loading} onClick={handleApplyToJob} disabled={!message.trim()}>
                    Submit Application
                </ButtonWithLoading>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </AdminPage>
  );
};

export default WorkerJobDetails;
