"use client";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { DocReviewLogo } from "./logo";
import { NavItem } from "./nav-item";
import { UserNav } from "./user-nav";
import { navItems } from "@/constants/navigation";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${isCollapsed ? "w-16" : "w-75"} h-screen bg-slate-600 border-r border-[#e8e4df] flex flex-col relative`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-slate-500 hover:bg-slate-400 transition-colors"
      >
        <ChevronLeft className={`h-4 w-4 text-white transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Logo */}
      <div className={`p-6 border-b border-[#e8e4df]`}>
        {!isCollapsed && <DocReviewLogo />}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      {/* User Navigation */}
      <div className="mt-6 border-t border-[#e8e4df]">
        <UserNav isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
