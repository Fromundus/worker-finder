import AdminPageMain from '@/components/custom/AdminPageMain'
import React, { useEffect, useState } from 'react'
import api from '@/api/axios'
import { toast } from '@/hooks/use-toast'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock, CheckCircle, XCircle, Star, MessageSquare, Users
} from 'lucide-react';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";

const EmployerApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Fetch applications and jobs
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, jobsRes] = await Promise.all([
          api.get("/applications-employer"),
          api.get("/job-posts-employer"),
        ]);
        setApplications(appsRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load applications or jobs",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplicationAction = async (applicationId: number, action: "accepted" | "rejected") => {
    try {
      const res = await api.put(`/applications/${applicationId}/status`, {
        status: action,
      });
      setApplications(prev =>
        prev.map(app => app.id === applicationId ? res.data.application : app)
      );
      toast({
        title: `Application ${action}`,
        description: `The application has been ${action}.`,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  // filter by job
  const jobFilteredApplications = selectedJobId === "all"
    ? applications
    : applications.filter(app => String(app.job_post?.id) === selectedJobId);

  const pendingApplications = jobFilteredApplications.filter(app => app.status === "pending");
  const acceptedApplications = jobFilteredApplications.filter(app => app.status === "accepted");
  const rejectedApplications = jobFilteredApplications.filter(app => app.status === "rejected");
  const withdrawnApplications = jobFilteredApplications.filter(app => app.status === "withdrawn");
  const completedApplications = jobFilteredApplications.filter(app => app.status === "completed");

  const ApplicationCard = ({ application }: { application: any }) => {
    const worker = application.user;
    const job = application.job_post;

    return (
      <Card className="shadow-soft hover:shadow-medium transition-smooth">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{worker?.name}</CardTitle>
              <CardDescription>{job?.title}</CardDescription>
            </div>
            <Badge className={`text-white
              ${application.status === "pending" && "bg-orange-500 hover:bg-orange-600"}
              ${application.status === "accepted" && "bg-green-500 hover:bg-green-600"}
              ${application.status === "rejected" && "bg-red-500 hover:bg-red-600"}
              ${application.status === "withdrawn" && "bg-gray-500 hover:bg-gray-600"}
              ${application.status === "completed" && "bg-primary text-black"}
            `}>{application.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col justify-between">
          <div className='flex flex-col gap-4'>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Experience</p>
                <p className="font-medium">{worker?.experience || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">{worker?.average_rating || 0}/5</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Applied</p>
                <p className="font-medium">
                  {new Date(application.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {worker?.skills
                  ? worker.skills.split(",").map((skill: string, idx: number) => (
                      <Badge key={idx} variant="secondary">{skill.trim()}</Badge>
                    ))
                  : <span className="text-muted-foreground text-sm">No skills listed</span>}
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cover Message:</p>
                  <p className="text-sm text-muted-foreground mt-1">{application.message}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <p className="text-sm text-muted-foreground">Contact: {worker?.contact_number}</p>
            </div>
          </div>

          {application.status === "pending" && (
            <div className="flex gap-2 pt-2">
              <Button
                className="bg-green-500 hover:bg-green-600 flex-1 text-white"
                size="sm"
                onClick={() => handleApplicationAction(application.id, "accepted")}
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Accept
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleApplicationAction(application.id, "rejected")}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminPageMain title="Applications" description="Review and manage job applications">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Clock className="h-8 w-8 text-orange-500" />
          <div><p className="text-2xl font-bold">{pendingApplications.length}</p>
            <p className="text-sm text-muted-foreground">Pending Review</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <div><p className="text-2xl font-bold">{acceptedApplications.length}</p>
            <p className="text-sm text-muted-foreground">Accepted</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <XCircle className="h-8 w-8 text-gray-500" />
          <div><p className="text-2xl font-bold">{withdrawnApplications.length}</p>
            <p className="text-sm text-muted-foreground">Withdrawn</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <XCircle className="h-8 w-8 text-destructive" />
          <div><p className="text-2xl font-bold">{rejectedApplications.length}</p>
            <p className="text-sm text-muted-foreground">Rejected</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-primary" />
          <div><p className="text-2xl font-bold">{completedApplications.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p></div>
        </CardContent></Card>
      </div>

      <h2 className="text-xl font-semibold">Applications ({jobFilteredApplications.length})</h2>

      <Select value={selectedJobId} onValueChange={setSelectedJobId}>
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Filter by Job" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Jobs</SelectItem>
          {jobs.map(job => (
            <SelectItem key={job.id} value={String(job.id)}>
              {job.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingApplications.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedApplications.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedApplications.length})</TabsTrigger>
          <TabsTrigger value="withdrawn">Withdrawn ({withdrawnApplications.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedApplications.length})</TabsTrigger>
          <TabsTrigger value="all">All ({jobFilteredApplications.length})</TabsTrigger>
        </TabsList>

        {["pending", "accepted", "rejected", "withdrawn", "completed", "all"].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(tab === "all" ? jobFilteredApplications : jobFilteredApplications.filter(a => a.status === tab)).map(app => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
            {(tab === "all" ? jobFilteredApplications : jobFilteredApplications.filter(a => a.status === tab)).length === 0 && (
              <Card className="shadow-soft">
                <CardContent className="p-8 text-center">
                  {tab === "pending" && <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />}
                  {tab === "accepted" && <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />}
                  {tab === "rejected" && <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />}
                  {tab === "all" && <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />}
                  <h3 className="text-lg font-medium mb-2">No {tab} applications</h3>
                  <p className="text-muted-foreground">Nothing here yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </AdminPageMain>
  );
};

export default EmployerApplications;
