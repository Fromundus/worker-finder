import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  ClipboardCheck,
  UserCheck,
  Building,
  BarChart3,
  Settings,
  HeartPulse,
  Search,
  Briefcase,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { adminNavigations, workerNavigations, employerNavigations } from "@/data/navigations";
import { useAuth } from "@/store/auth";
import logo from "../assets/logo.png";
import api from "@/api/axios";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    group: "Main"
  }
];

export function AppSidebar() {
  const { user } = useAuth();

  let navigations: typeof menuItems = [];

  if(user.role === "admin"){
    navigations = adminNavigations;
  } else if (user.role === "worker"){
    navigations = workerNavigations;
  } else if (user.role === "employer"){
    navigations = employerNavigations;
  }

  const groupedItems = navigations.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const [notifications, setNotifications] = useState<number>(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/notifications-count");
        // console.log(res);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load notifications.",
          variant: "destructive",
        });
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            {/* <span className="text-primary-foreground font-bold text-sm">F</span> */}
            {/* <img className="w-8" src={logo} alt="" /> */}
            <Briefcase />
          </div>
          <div>
            <h2 className="font-semibold text-lg">CATANDUANES</h2>
            <p className="text-xs text-muted-foreground">Worker Finder</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {Object.entries(groupedItems).map(([group, items]) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => {
                  return (
                      <NavLink
                        key={index}
                        to={item.url}
                        end={`${item.url}` === `/${user.role}`}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-accent text-foreground"
                              : "hover:bg-accent"
                          }`
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex items-center justify-between w-full">{item.title} {item.title === "Notifications" && notifications > 0 && <div className="bg-red-500 size-2 rounded-full"></div>}</span>
                      </NavLink>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}