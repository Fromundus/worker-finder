import AdminPageMain from '@/components/custom/AdminPageMain'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Briefcase, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';


const WorkerDashboard = () => {
  return (
    <AdminPageMain title='Dashboard Overview' description="Here's what's happening with your job search">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{10}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{2}</div>
            <p className="text-xs text-muted-foreground">Active opportunities</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{0}/5</div>
            <p className="text-xs text-muted-foreground">From employers</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{10}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications & Nearby Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest job applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <Link to="/worker/applications" className="block">
              <Button variant="outline" className="w-full">
                View All Applications
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Nearby Jobs */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Jobs Near You</CardTitle>
            <CardDescription>New opportunities in your area</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <Link to="/worker/jobs" className="block">
              <Button variant="outline" className="w-full">
                View All Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminPageMain>
  )
}

export default WorkerDashboard
