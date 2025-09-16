import AdminPageMain from '@/components/custom/AdminPageMain'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, FileText, Star, UserCheck } from 'lucide-react';
import api from '@/api/axios';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_workers: 0,
    total_employers: 0,
    total_applications: 0,
    total_bookings: 0,
    total_jobs: 0,
    open_jobs: 0,
    average_rating: 0,
    recent_users: [] as any[],
    recent_applications: [] as any[],
    recent_job_posts: [] as any[],
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/admin');
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
    <AdminPageMain title='Admin Dashboard' description='Overview of the entire platform'>
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_users}</div>
            <p className="text-xs text-muted-foreground">All registered</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.total_workers}</div>
            <p className="text-xs text-muted-foreground">Active workers</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.total_employers}</div>
            <p className="text-xs text-muted-foreground">Hiring companies</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {stats.average_rating.toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">Across platform</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Newly registered on the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recent_users.length > 0 ? (
              <ul className="space-y-2">
                {stats.recent_users.map((u: any) => (
                  <li key={u.id} className="flex justify-between text-sm">
                    <span className="font-medium">{u.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent users</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recent Job Posts</CardTitle>
            <CardDescription>Latest jobs added by employers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recent_job_posts.length > 0 ? (
              <ul className="space-y-2">
                {stats.recent_job_posts.map((job: any) => (
                  <li key={job.id} className="flex justify-between text-sm">
                    <span className="font-medium">{job.title}</span>
                    <Badge className='bg-green-500 hover:bg-green-600'>{job.status}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No recent job posts</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="shadow-medium mt-6">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest applications submitted</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.recent_applications.length > 0 ? (
            <ul className="space-y-2">
              {stats.recent_applications.map((app: any) => (
                <li key={app.id} className="flex justify-between text-sm">
                  <span>
                    <span className="font-medium">{app.user?.name}</span> applied for{" "}
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
        </CardContent>
      </Card>
    </AdminPageMain>
  )
}

export default AdminDashboard
