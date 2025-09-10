import AdminPageMain from '@/components/custom/AdminPageMain'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Briefcase, Clock, Plus, Star, Users } from 'lucide-react';


const EmployerDashboard = () => {
  return (
    <AdminPageMain title='Dashboard Overview' description='Manage your job posts and applications'>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Job Posts</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{5}</div>
              <p className="text-xs text-muted-foreground">Currently hiring</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{100}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{20}</div>
              <p className="text-xs text-muted-foreground">Need attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{0}/5</div>
              <p className="text-xs text-muted-foreground">From workers</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications & Active Jobs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest applications for your job posts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/employer/applications" className="block">
                <Button variant="ghost" className="w-full">
                  View All Applications
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Active Job Posts */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Active Job Posts</CardTitle>
              <CardDescription>Your current job openings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/employer/jobs" className="block">
                <Button variant="ghost" className="w-full">
                  Manage Job Posts
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for employers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Link to="/employer/feedback">
                <Button variant="outline" className="w-full h-auto p-4 flex flex-col gap-2">
                  <Star className="h-6 w-6" />
                  <span>Give Feedback</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
    </AdminPageMain>
  )
}

export default EmployerDashboard
