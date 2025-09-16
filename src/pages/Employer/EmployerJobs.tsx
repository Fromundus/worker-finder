import AdminPageMain from '@/components/custom/AdminPageMain'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Briefcase, Check, Clock, DollarSign, Pause, Play, Plus, Search, Users, X, MapPin, Star } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import api from '@/api/axios';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/store/auth';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import barangays from "@/data/barangays.json";
import { cn } from "@/lib/utils";
import ButtonWithLoading from '@/components/custom/ButtonWithLoading';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { MapSelectorDialog } from '@/components/custom/MapSelectorDialog';

const EmployerJobs = () => {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    job_type: '',
    salary: '',
    location_id: '',
    lat: '',
    lng: '',
  });
  const [activeTab, setActiveTab] = useState("all");

  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // fetch jobs
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/job-posts-employer');
      console.log(res);
      setJobPosts(res.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load job posts.",
        variant: "destructive",
      });
    }
  };

  // create job post
  const handleCreateJob = async () => {
    setLoading(true);
    try {
      await api.post('/job-posts', {
        ...newJob,
        user_id: user.id,
        status: 'open',
      });
      toast({
        title: "Success",
        description: "Job post created successfully.",
      });
      setIsCreateDialogOpen(false);
      setNewJob({ title: '', description: '', job_type: '', salary: '', location_id: '', lat: '', lng: '' });
      fetchJobs();
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.response?.data?.message || "Error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // change status
  const handleStatusChange = async (jobId: number, status: string) => {
    setLoading(true);
    try {
      await api.put(`/job-posts/${jobId}/status`, { status });
      toast({
        title: "Updated",
        description: `Job status changed to ${status}.`,
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: number, action: "withdrawn") => {
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status: action,
      });
      toast({
        title: `Application ${action}`,
        description: `The application has been ${action}.`,
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive",
      });
    }
  };

  // filter by search + status
  const filteredJobs = jobPosts.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" ? true : job.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAddFeedback = (application: any) => {
    setSelectedApplication(application);
    setRating(0);
    setComment("");
    setIsFeedbackDialogOpen(true);
  };

  // --- submit feedback ---
  const handleSubmitFeedback = async () => {
    if (!selectedApplication) return;
    try {
      await api.post(`/feedbacks/${selectedApplication.id}`, {
        to_user_id: selectedApplication.user.id,
        job_post_id: selectedApplication.job_post_id,
        rating,
        comment,
      });
      toast({
        title: "Feedback submitted",
        description: "Your feedback has been saved.",
      });
      setIsFeedbackDialogOpen(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.response.data.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <AdminPageMain
      title='My Job Posts'
      description='Manage your job openings'
      topAction={
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Job Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Job Post</DialogTitle>
              <DialogDescription>
                Fill in the details for your new job opening
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Title */}
              <div className='space-y-2'>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Construction Worker"
                />
              </div>

              {/* Description */}
              <div className='space-y-2'>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the job requirements..."
                  rows={3}
                />
              </div>

              {/* Job type + salary */}
              <div className="grid grid-cols-2 gap-2">
                <div className='space-y-2'>
                  <Label htmlFor="job_type">Type</Label>
                  <Select value={newJob.job_type} onValueChange={(value) => setNewJob(prev => ({ ...prev, job_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full-time</SelectItem>
                      <SelectItem value="part-time">Part-time</SelectItem>
                      <SelectItem value="one-time">One-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="salary">Daily Rate (₱)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newJob.salary}
                    onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                    placeholder="500"
                  />
                </div>
              </div>

              {/* Barangay selection */}
              <div className="flex flex-col gap-3">
                <Label htmlFor="address">Address (Barangay)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                        !newJob.location_id && "text-muted-foreground"
                      )}
                    >
                      {newJob.location_id
                        ? `${barangays.find(b => b.id === Number(newJob.location_id))?.name}, ${barangays.find(b => b.id === Number(newJob.location_id))?.municipality}`
                        : "Select barangay"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search barangay..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-y-auto">
                          {barangays.map((b) => (
                            <CommandItem
                              key={b.id}
                              value={`${b.name}, ${b.municipality}`}
                              onSelect={() => {
                                setNewJob((prev) => ({
                                  ...prev,
                                  location_id: b.id.toString(),
                                  lat: b.lat.toString(),
                                  lng: b.lng.toString(),
                                }));
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  newJob.location_id === b.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {b.name}, {b.municipality}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Map Selector */}
              <div className="flex flex-col gap-3">
                <Label>Exact Location</Label>
                <MapSelectorDialog
                  lat={newJob.lat}
                  lng={newJob.lng}
                  onSelect={(lat, lng) =>
                    setNewJob((prev) => ({ ...prev, lat, lng }))
                  }
                />
                <div className="text-sm text-muted-foreground">
                  {newJob.lat && newJob.lng
                    ? `Selected: Lat ${newJob.lat}, Lng ${newJob.lng}`
                    : "No location selected"}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 w-full">
                <ButtonWithLoading
                  loading={loading}
                  disabled={
                    loading ||
                    !newJob.title ||
                    !newJob.description ||
                    !newJob.job_type ||
                    !newJob.salary ||
                    !newJob.location_id ||
                    !newJob.lat ||
                    !newJob.lng
                  }
                  onClick={handleCreateJob}
                >
                  Create Job Post
                </ButtonWithLoading>
                <Button className='w-full' variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      }
    >

      {/* Search */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your job posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for status filter */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="my-4">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="filled">Filled</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Job Posts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Jobs ({filteredJobs.length})</h2>
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            // <Card key={job.id} className="shadow-soft hover:shadow-medium transition-smooth">
            //   <CardHeader>
            //     <div className="flex items-start justify-between">
            //       <div className="flex-1">
            //         <CardTitle className="text-lg">{job.title}</CardTitle>
            //         <CardDescription className="mt-1">
            //           Posted {new Date(job.created_at).toLocaleDateString()}
            //         </CardDescription>
            //       </div>
            //       <div className="flex items-center gap-2">
            //         <Badge className={`text-white
            //           ${job.status === "open" && "bg-green-500"}  
            //           ${job.status === "paused" && "bg-orange-500"}  
            //           ${job.status === "closed" && "bg-red-500"}  
            //         `}>{job.status}</Badge>
            //         <div className="flex gap-1">
            //           {(job.status === "open" || job.status === "paused") && <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, 'filled')}>
            //             <Check className="h-4 w-4" />
            //           </Button>}
            //           {job.status === 'open' ? (
            //             <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, 'paused')}>
            //               <Pause className="h-4 w-4" />
            //             </Button>
            //           ) : job.status === 'paused' ? (
            //             <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, 'open')}>
            //               <Play className="h-4 w-4" />
            //             </Button>
            //           ) : null}
            //           {job.status !== "closed" && (
            //             <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, 'closed')}>
            //               <X className="h-4 w-4" />
            //             </Button>
            //           )}
            //         </div>
            //       </div>
            //     </div>
            //   </CardHeader>
            //   <CardContent className="space-y-4">
            //     <p className="text-sm text-muted-foreground">{job.description}</p>
            //     <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            //       {job.location && (
            //         <div className="flex items-center gap-1">
            //           <MapPin className="h-4 w-4" />
            //           {job.location.barangay}, {job.location.municipality}
            //         </div>
            //       )}
            //       <div className="flex items-center gap-1">
            //         <Clock className="h-4 w-4" />
            //         {job.job_type}
            //       </div>
            //       <div className="flex items-center gap-1">
            //         <DollarSign className="h-4 w-4" />
            //         ₱{job.salary}/day
            //       </div>
            //       {(job.status === "open" || job.status === "paused") && <div className="flex items-center gap-1">
            //         <Users className="h-4 w-4" />
            //         {job.applications_count || 0} applications
            //       </div>}
            //     </div>
            //   </CardContent>
            // </Card>

            <Card key={job.id} className="shadow-soft hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="mt-1">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-white
                      ${job.status === "open" && "bg-green-500 hover:bg-green-600"}  
                      ${job.status === "paused" && "bg-orange-500 hover:bg-orange-600"}  
                      ${job.status === "filled" && "bg-blue-500 hover:bg-blue-600"}  
                      ${job.status === "closed" && "bg-red-500 hover:bg-red-600"}  
                    `}>{job.status}</Badge>

                    <div className="flex gap-1">
                      {((job.status === "open" || job.status === "paused") && (job.applications?.length > 0)) && (
                        <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, "filled")}>
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {job.status === "open" ? (
                        <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, "paused")}>
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : job.status === "paused" ? (
                        <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, "open")}>
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : null}
                      {((job.status === "open" && job.applications?.length === 0) || job.status === "filled") && (
                        <Button disabled={loading} size="sm" variant="ghost" onClick={() => handleStatusChange(job.id, "closed")}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{job.description}</p>

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
                  {(job.status === "open" || job.status === "paused") && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {job.applications_count || 0} applications
                    </div>
                  )}
                </div>

                {/* Show active users if job is filled */}
                {(job.status === "filled" || job.status === "closed")&& job.applications?.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-sm mb-2">Workers</h4>
                    <ul className="space-y-2">
                      {job.applications.map((app: any) => (
                        <li key={app.id} className="flex items-center justify-between px-3 rounded-md">
                          <span>{app.user?.name}</span>
                          <div className='flex items-center gap-4'>
                            <Badge className={`
                              ${app.status === "active" && "bg-green-500 hover:bg-green-600 text-white"}  
                              ${app.status === "completed" && "bg-primary"}  
                            `}>{app.status}</Badge>
                            {(app.status === "active" && job.status !== "closed") && <Button disabled={loading} size="sm" variant="destructive" onClick={() => handleApplicationAction(app.id, "withdrawn")}>
                              <X className="h-4 w-4" /> Withdraw
                            </Button>}
                            {(app.status === "completed" && !app.workerIsRated && job.status === "closed") && <Button className='bg-yellow-500 hover:bg-yellow-600 hover:text-white text-white' disabled={loading} size="sm" variant="outline" onClick={() => handleAddFeedback(app)}>
                              <Star className="h-4 w-4" /> Rate
                            </Button>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {job.status === "filled" && job.applications?.length === 0 && (
                  <div className="border-t pt-4 text-sm text-muted-foreground">
                    No active workers recorded.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="shadow-soft">
            <CardContent className="p-8 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No job posts found</h3>
              <p className="text-muted-foreground mb-4">
                {jobPosts.length === 0
                  ? "Create your first job post to start hiring"
                  : "Try adjusting your filters or search terms"}
              </p>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Job Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rate Worker</DialogTitle>
            <DialogDescription>
              Provide a rating and feedback for{" "}
              <span className="font-medium">{selectedApplication?.user?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rating Stars */}
            <div className="flex gap-2 justify-center">
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
            </div>

            {/* Comment */}
            <div>
              <Label htmlFor="comment">Comment</Label>
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
                disabled={rating === 0}
                onClick={handleSubmitFeedback}
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageMain>
  )
}

export default EmployerJobs
