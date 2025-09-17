import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import GuestLayout from "./layouts/GuestLayout";
import { useAuth } from "./store/auth";
import React from "react";
import PrivateRoute from "./components/PrivateRoute";
import SuperadminLayout from "./layouts/SuperadminLayout";
import { DashboardOverview } from "./components/DashboardOverview";
import Test from "./pages/Test";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import ProfilePage from "./pages/ProfilePage";
import AccountsPage from "./pages/Superadmin/AccountsPage";
import AccountPage from "./pages/Superadmin/AccountPage";
import AuthLayout from "./layouts/AuthLayout";
import WorkerDashboard from "./pages/Worker/WorkerDashboard";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import EmployerJobs from "./pages/Employer/EmployerJobs";
import EmployerApplications from "./pages/Employer/EmployerApplications";
import Notifications from "./pages/Notifications";
import WorkerJobs from "./pages/Worker/WorkerJobs";
import WorkerApplications from "./pages/Worker/WorkerApplications";
import Register from "./pages/Register";
import Feedbacks from "./pages/Feedbacks";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import WorkerBookings from "./pages/Worker/WorkerBookings";
import EmployerBookings from "./pages/Employer/EmployerBookings";
import MessagesPage from "./pages/MessagesPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import WorkerJobDetails from "./pages/Worker/WorkerJobDetails";
import AdminProfilePage from "./pages/Admin/AdminProfilePage";
import AdminProfileUpdatePage from "./pages/Admin/AdminProfileUpdatePage";
import ConversationPage from "./pages/ConversationPage";

const queryClient = new QueryClient();

const App = () => {
  const { token, fetchUser, connection, updateConnection } = useAuth();

  React.useEffect(() => {
    updateConnection(true);

    if (token) {
      fetchUser();
    }
  }, [token]);

  if(!connection){
    return (
      <div>Please connect to the internet.</div>
    )
  }
  
  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ficelco-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuestLayout />}>
              <Route index element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<PrivateRoute requiredRole="worker" />}>
              <Route path="/worker" element={<AuthLayout />}>
                <Route index element={<WorkerDashboard />} />
                <Route path="jobs" element={<WorkerJobs />} />
                <Route path="jobs/:id" element={<WorkerJobDetails />} />
                <Route path="applications" element={<WorkerApplications />} />
                <Route path="bookings" element={<WorkerBookings />} />
                <Route path="feedbacks" element={<Feedbacks />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="messages/:conversationId" element={<ConversationPage />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/update" element={<ProfileUpdatePage />} />
                <Route path="profile/:id" element={<ProfilePage />} />
              </Route>
            </Route>
            
            <Route element={<PrivateRoute requiredRole="employer" />}>
              <Route path="/employer" element={<AuthLayout />}>
                <Route index element={<EmployerDashboard />} />
                <Route path="jobs" element={<EmployerJobs />} />
                <Route path="applications" element={<EmployerApplications />} />
                <Route path="bookings" element={<EmployerBookings />} />
                <Route path="feedbacks" element={<Feedbacks />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="messages/:conversationId" element={<ConversationPage />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/update" element={<ProfileUpdatePage />} />
                <Route path="profile/:id" element={<ProfilePage />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute requiredRole="admin" />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="feedbacks" element={<Feedbacks />} />
                <Route path="accounts" element={<AccountsPage />} />
                <Route path="accounts/:id" element={<ProfilePage />} />
                <Route path="profile" element={<AdminProfilePage />} />
                <Route path="profile/update" element={<AdminProfileUpdatePage />} />
              </Route>
            </Route>

            <Route path="/test" element={<Test />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)};

export default App;
