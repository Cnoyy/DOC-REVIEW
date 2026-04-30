"use client";

import { useState } from "react";
import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebar as s } from "@/lib/theme";
import { DocReviewLogo } from "./logo";
import { NavItem } from "./nav-item";
import { UserNav } from "./user-nav";
import { navItems } from "@/constants/navigation";

interface SidebarProps {
 isMobileOpen?: boolean;
 onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
 const [isCollapsed, setIsCollapsed] = useState(false);

 return (
 <>
 {/* Mobile overlay */}
 {isMobileOpen && (
 <div className={s.overlay} onClick={onMobileClose} />
 )}

 <aside
 className={cn(
 s.root,
// Mobile: fixed drawer that slides in/out
 s.mobile,
 isMobileOpen ? "translate-x-0" : "-translate-x-full",
// Desktop: in-flow, width animates
 s.desktop,
 isCollapsed ? "lg:w-[68px]" : "lg:w-[260px]"
 )}
 >
 {/* Header */}
 <div
 className={cn(
 s.header,
 isCollapsed ? "lg:justify-center" : "lg:justify-between"
 )}
 >
 {/* Logo — fades + collapses on desktop */}
 <div
 className={cn(
 s.logoWrap,
 isCollapsed ? s.logoWrapCollapsed : s.logoWrapExpanded
 )}
 >
 <DocReviewLogo />
 </div>

 {/* Desktop collapse toggle */}
 <button
 onClick={() => setIsCollapsed(!isCollapsed)}
 className={cn(s.toggleBtn, !isCollapsed && "ml-2")}
 title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
 >
 <PanelLeft
 className={cn(
 "h-[18px] w-[18px] text-white transition-transform duration-300",
 isCollapsed && "rotate-180"
 )}
 />
 </button>

 {/* Mobile close button */}
 <button onClick={onMobileClose} className={s.closeMobileBtn}>
 <X className="h-[18px] w-[18px] text-white" />
 </button>
 </div>

 {/* Navigation */}
 <nav className={cn(s.navRoot, "sidebar-nav")}>
 <ul className={s.navList}>
 {navItems.map((item) => (
 <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
 ))}
 </ul>
 </nav>

 {/* User navigation */}
 <div className="flex-shrink-0">
 <UserNav isCollapsed={isCollapsed} />
 </div>
 </aside>
 </>
 );
}