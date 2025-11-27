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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

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

  return (
    <Sidebar collapsible="icon" className="border-r transition-all duration-300">
      <SidebarHeader className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center">
          <Briefcase />
        </div>
        <div
          className="
            overflow-hidden whitespace-nowrap transition-all duration-300
            group-data-[collapsible=icon]:hidden
          "
        >
          <h2 className="font-semibold text-lg">CATANDUANES</h2>
          <p className="text-xs text-muted-foreground">Worker Finder</p>
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
                    <Tooltip key={index}>
                      <TooltipTrigger>
                        <NavLink
                          to={item.url}
                          end={`${item.url}` === `/${user.role}`}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive ? "bg-accent text-foreground" : "hover:bg-accent"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span
                            className="
                              overflow-hidden whitespace-nowrap transition-all duration-300
                              group-data-[collapsible=icon]:hidden
                            "
                          >
                            {item.title}
                            {/* {item.title === "Notifications" && notifications > 0 && (
                              <div className="bg-red-500 size-2 rounded-full inline-block ml-2"></div>
                            )} */}
                          </span>
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{item.title}</span>
                      </TooltipContent>
                    </Tooltip>
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