import AdminPageMain from '@/components/custom/AdminPageMain'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, Plus, Star, Users } from 'lucide-react';
import api from '@/api/axios';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/store/auth';
import { Badge } from '@/components/ui/badge';

const EmployerDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    active_job_posts: 0,
    total_applications: 0,
    pending_reviews: 0,
    average_rating: 0,
    recent_applications: [] as any[],
    recent_job_posts: [] as any[],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/employer');
      setStats(res.data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load dashboard stats.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminPageMain title='Dashboard Overview' description='Manage your job posts and applications'>
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Job Posts</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.active_job_posts}</div>
            <p className="text-xs text-muted-foreground">Currently hiring</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.total_applications}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.pending_reviews}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        {/* <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.average_rating.toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">From workers</p>
          </CardContent>
        </Card> */}
      </div>

      {/* Recent Applications & Active Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest applications for your job posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recent_applications.length > 0 ? (
              <ul className="space-y-2">
                {stats.recent_applications.map((app: any) => (
                  <li key={app.id} className="flex justify-between text-sm">
                    <span>
                      <span className="font-medium">{app.user?.first_name} {app.user?.middle_name} {app.user?.last_name} {app.user?.suffix}</span> applied
                      <span className="italic">{app.job_post?.title}</span>
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(app.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent applications</p>
            )}
            <Link to="/employer/applications" className="block pt-2">
              <Button variant="outline" className="w-full">View All Applications</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Active Job Posts</CardTitle>
            <CardDescription>Your current job openings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recent_job_posts.length > 0 ? (
              <ul className="space-y-2">
                {stats.recent_job_posts.map((job: any) => (
                  <li key={job.id} className="flex justify-between text-sm">
                    <span className="font-medium">{job.title}</span>
                    <Badge className='bg-green-500 hover:bg-green-600' >{job.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No active job posts</p>
            )}
            <Link to="/employer/jobs" className="block pt-2">
              <Button variant="outline" className="w-full">Manage Job Posts</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-medium mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for employers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/employer/jobs">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Create New Job Post</span>
              </Button>
            </Link>
            <Link to="/employer/applications">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Review Applications</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AdminPageMain>
  )
}

export default EmployerDashboard
