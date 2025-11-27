import NavItem from "@/types/NavItem";
import { Archive, Award, Bell, BookOpen, Briefcase, Calendar, CarFront, Coins, CreditCard, Database, DollarSign, Download, FileSignature, Folder, FolderOpen, Fuel, Heart, HelpCircle, Inbox, Logs, Megaphone, MessageCircle, Search, Star, Upload, UploadCloud, User, Zap } from "lucide-react";

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
} from "lucide-react";

export const workerNavigations = [
  {
    title: "Home",
    url: "/worker",
    icon: Home,
    group: "Navigation"
  },
  {
    title: "Find Jobs",
    url: "jobs",
    icon: Search,
    group: "Navigation"
  },
  {
    title: "My Applications",
    url: "applications",
    icon: FileText,
    group: "Navigation"
  },
  {
    title: "Bookings",
    url: "bookings",
    icon: BookOpen,
    group: "Navigation"
  },
  {
    title: "Feedbacks",
    url: "feedbacks",
    icon: Star,
    group: "Navigation"
  },
  {
    title: "Messages",
    url: "messages",
    icon: MessageCircle,
    group: "Navigation"
  },
  // {
  //   title: "Notifications",
  //   url: "notifications",
  //   icon: Bell,
  //   group: "Navigation"
  // },
  // {
  //   title: "Profile",
  //   url: "profile",
  //   icon: User,
  //   group: "Navigation"
  // },
];

export const employerNavigations = [
  {
    title: "Home",
    url: "/employer",
    icon: Home,
    group: "Navigation"
  },
    {
    title: "My Job Posts",
    url: "jobs",
    icon: Briefcase,
    group: "Navigation"
  },
  {
    title: "Applications",
    url: "applications",
    icon: FileText,
    group: "Navigation"
  },
  {
    title: "My Bookings",
    url: "bookings",
    icon: BookOpen,
    group: "Navigation"
  },
  {
    title: "Feedbacks",
    url: "feedbacks",
    icon: Star,
    group: "Navigation"
  },
  {
    title: "Messages",
    url: "messages",
    icon: MessageCircle,
    group: "Navigation"
  },
  // {
  //   title: "Notifications",
  //   url: "notifications",
  //   icon: Bell,
  //   group: "Navigation"
  // },
  // {
  //   title: "Profile",
  //   url: "profile",
  //   icon: User,
  //   group: "Navigation"
  // },
];

export const adminNavigations = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    group: "Navigation"
  },
  {
    title: "Accounts",
    url: "accounts",
    icon: Users,
    group: "Navigation"
  },
  {
    title: "Feedbacks",
    url: "feedbacks",
    icon: Star,
    group: "Navigation"
  },
  // {
  //   title: "Reports",
  //   url: "reports",
  //   icon: FileText,
  //   group: "Navigation"
  // },
  // {
  //   title: "Profile",
  //   url: "profile",
  //   icon: User,
  //   group: "Navigation"
  // },
]