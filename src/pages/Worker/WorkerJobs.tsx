import React, { useState, useEffect } from "react";
import AdminPageMain from "@/components/custom/AdminPageMain";
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
  Map,
  MapPin,
  Search,
  Star,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import api from "@/api/axios";
import { useAuth } from "@/store/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import ButtonWithLoading from "@/components/custom/ButtonWithLoading";
import MapFinder from "@/components/MapFinder";

const WorkerJobs = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());

  // filters
  const [municipality, setMunicipality] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  // application dialog state
  const [open, setOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get(user ? "/job-posts" : "/job-posts-public");
        setJobs(res.data.jobs);
        setAppliedJobs(new Set(res.data.appliedJobs));
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load jobs.",
          variant: "destructive",
        });
      }
    };

    fetchJobs();
  }, []);

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

      setAppliedJobs((prev) => new Set(prev).add(selectedJobId));
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

  const filteredJobs = jobs
    ?.filter((job) => job.status === "open")
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((job) =>
      municipality !== "all" ? job.location?.municipality === municipality : true
    )
    .filter((job) => (jobType !== "all" ? job.job_type === jobType : true))
    .filter((job) => {
      const salary = parseFloat(job.salary);
      const min = minSalary ? parseFloat(minSalary) : null;
      const max = maxSalary ? parseFloat(maxSalary) : null;

      if (min !== null && salary < min) return false;
      if (max !== null && salary > max) return false;
      return true;
    });

  const municipalities = [
    ...new Set(jobs.map((job) => job.location?.municipality).filter(Boolean)),
  ];

  console.log(filteredJobs);

  return (
    <AdminPageMain
      title="Find Jobs"
      description="Discover opportunities in Catanduanes"
      topAction={
        <MapFinder />
      }
    >
      {/* Search + Filters */}
      <Card className="shadow-soft">
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for jobs by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Municipality Filter */}
            <Select value={municipality} onValueChange={setMunicipality}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Municipality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Municipalities</SelectItem>
                {municipalities.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Job Type Filter */}
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
              </SelectContent>
            </Select>

            {/* Salary Filters */}
            <Input
              type="number"
              placeholder="Min Salary"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Salary"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Available Jobs ({filteredJobs.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const isApplied = appliedJobs.has(job.id);

            return (
              <Card
                key={job.id}
                className="shadow-soft hover:shadow-medium transition-smooth"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span className="flex flex-col gap-2">
                          <span className="flex items-center gap-2 mt-1">
                            <Building className="h-4 w-4" />
                            {job.user?.business_name || job.user?.name}
                          </span>
                          <span className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {job.user?.average_rating}
                          </span>
                        </span>
                      </CardDescription>
                    </div>
                    <Badge className={`text-white
                      ${job.status === "open" && "bg-green-500 hover:bg-green-600"}  
                      ${job.status === "paused" && "bg-orange-500 hover:bg-orange-600"}  
                      ${job.status === "filled" && "bg-blue-500 hover:bg-blue-600"}  
                      ${job.status === "closed" && "bg-red-500 hover:bg-red-600"}  
                    `}>{job.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
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
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Dialog */}
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
    </AdminPageMain>
  );
};

export default WorkerJobs;
