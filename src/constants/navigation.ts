import { 
  Search, 
  Upload, 
  FileText, 
  ListChecks,
  ChevronDown,
  User,
  LogOut
} from "lucide-react";

export const navItems = [
  {
    title: "Upload Documents",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Search",
    href: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Documents Library",
    href: "/dashboard/library",
    icon: FileText,
  },
  {
    title: "Review Documents",
    href: "/dashboard/reviewer",
    icon: ListChecks,
  },
];

export const userNavItems = [
  {
    title: "Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    title: "Logout",
    href: "/auth/login",
    icon: LogOut,
  },
];
