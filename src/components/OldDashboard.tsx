import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Newspaper, 
  Gavel, 
  Download, 
  Settings,
  Search,
  Bell,
  User,
  Menu,
  X,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardOverview } from "./DashboardOverview";
import { ThemeToggle } from "./ThemeToggle";
import logo from "../assets/logo.png";
import { useAuth } from "@/store/auth";
import NavItem from "@/types/NavItem";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Members", href: "/members", icon: Users },
  { name: "Billing", href: "/billing", icon: CreditCard },
  { name: "News & Advisories", href: "/news", icon: Newspaper },
  { name: "Biddings", href: "/biddings", icon: Gavel },
  { name: "Downloads", href: "/downloads", icon: Download },
  { name: "Settings", href: "/settings", icon: Settings },
];

type Props = {
  navItems: NavItem[];
}

export default function OldDashboard({ navItems }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const { logout, user } = useAuth();
  
  const navigate = useNavigate();
  
  const userName = user?.name?.split("").slice(0, 2).join("").toUpperCase();

  // console.log(user.name.split("").slice(0, 2).join(""));

  const isActive = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      const res = await logout();
      navigate('/login');
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 lg:left-64 right-0 z-30 bg-card border-b border-border shadow-soft">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            {user.role !== 'user' && <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>}

            {user.role === "user" && <div className="lg:hidden flex items-center gap-2 w-full">
              <img className="w-8" src={logo} alt="" />
              <h1 className="text-xl font-bold text-foreground">FICELCO</h1>
              {/* <p className="text-sm text-muted-foreground">Admin Portal</p> */}
            </div>}
            
            {/* <div className="relative w-96 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members, bills, or reports..."
                className="pl-10 bg-secondary border-border focus:ring-primary"
              />
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            {user.role !== "user" && <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse-soft" />
            </Button>}

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
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
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
        </div>
      </header>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Layout container with top padding for fixed header */}
      <div className="lg:flex lg:h-screen">
        {/* Sidebar */}
        <div className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:top-0 lg:translate-x-0 lg:flex lg:flex-shrink-0
        `}>
          <div className="flex flex-col h-full w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-3 border-b">
              <div className="flex items-center gap-2 w-full">
                <img className="w-8" src={logo} alt="" />
                <h1 className="text-xl font-bold text-foreground">FICELCO</h1>
                {/* <p className="text-sm text-muted-foreground">Admin Portal</p> */}
              </div>
            </div>

            {/* Navigation - scrollable */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2 w-full">
              {navItems.map((item) => {
                // const active = isActive(item.href);
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.end}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 animate-slide-in
                      ${isActive 
                        ? 'bg-primary text-primary-foreground shadow-electric' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {/* <item.icon className="h-5 w-5" /> */}
                    {item.icon}
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <div className="text-xs text-muted-foreground text-center">
                FICELCO Electric Company
                <br />
                Admin Dashboard v1.0
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 mt-[55px] mb-[55px] lg:mb-0 lg:pl-0 overflow-y-auto">
          <main className="p-6">
            {/* <DashboardOverview /> */}
            <Outlet />
          </main>
        </div>
      </div>

      {user.role === "user" && <div className="fixed bottom-0 left-0 lg:left-64 right-0 z-30 bg-card border-t border-border shadow-soft lg:hidden">
          <nav className="flex items-center justify-evenly overflow-y-auto w-full">
              {navItems.map((item) => {
                // const active = isActive(item.href);
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    end={item.end}
                    className={({ isActive }) => `
                      flex flex-col items-center px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200 animate-slide-in
                      ${isActive 
                        ? 'text-primary shadow-electric' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {/* <item.icon className="h-5 w-5" /> */}
                    {item.icon}
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
      </div>}
    </div>
  );
}