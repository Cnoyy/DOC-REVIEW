"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebar as s } from "@/lib/theme";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
 title: string;
 href: string;
 icon: LucideIcon;
 isCollapsed?: boolean;
}

export function NavItem({ title, href, icon: Icon, isCollapsed = false }: NavItemProps) {
 const pathname = usePathname();
 const isActive = pathname === href;

 return (
 <li>
 <Link
 href={href}
 title={isCollapsed ? title : undefined}
 className={cn(
 s.navItem,
 isCollapsed ? s.navItemCollapsed : s.navItemExpanded,
 isActive && s.navItemActive
 )}
 >
 <Icon className="h-[18px] w-[18px] shrink-0" />
 <span className={cn(s.navLabel, isCollapsed ? s.navLabelCollapsed : s.navLabelExpanded)}>
 {title}
 </span>
 </Link>
 </li>
 );
}