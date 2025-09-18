import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  AlertTriangle,
  Bell,
  Settings, 
  User
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/store/auth";
import api from "@/api/axios";
import { format } from "date-fns";
import { Conversation } from "@/types/Conversation";
import { toast } from "@/hooks/use-toast";
import { createEcho } from "@/lib/echo";
export default function Dashboard() {
  const { logout, user, token } = useAuth();

  const navigate = useNavigate();
  
  const userName = user?.name?.split("").slice(0, 2).join("").toUpperCase();

  const handleLogout = async () => {
    try {
      const res = await logout();
      navigate('/');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = () => {
    api.get("/conversations").then((res) => setConversations(res.data));
  }

  useEffect(() => {
    if (!token) return;

    fetchConversations();

    const echo = createEcho(token);

    const channel = echo.private(`users.${user.id}`);
    
    console.log(token);

    channel.listen(".MessageSent", (message: any) => {
      console.log("📩 New message for you!", message);

      fetchConversations();

      toast({
        title: "You received a new message",
      })
    });

    return () => {
      echo.leave(`users.${user.id}`);
    };
  }, [token]);
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navigation */}
          <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {/* {currentPageName} */}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-background border border-border text-foreground">{userName}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/${user.role}/profile`)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/${user.role}/profile/update`)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet context={{
              conversations,
              fetchConversations,
            }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}