"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { sidebar as s } from "@/lib/theme";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/service/auth";

interface UserNavProps {
 isCollapsed?: boolean;
}

export function UserNav({ isCollapsed = false }: UserNavProps) {
 const [isOpen, setIsOpen] = useState(false);
 const containerRef = useRef<HTMLDivElement>(null);
 const router = useRouter();

 const handleLogout = async () => {
  try {
    await logoutUser();
    // Clear client-side auth store
    const { useAuthStore } = await import("@/store/auth-store");
    useAuthStore.getState().logout();
    router.push("/");
  } catch (error) {
    console.error("Logout error:", error);
  }
 };

 useEffect(() => {
 function handleClickOutside(e: MouseEvent) {
 if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
 setIsOpen(false);
 }
 }
 if (isOpen) document.addEventListener("mousedown", handleClickOutside);
 return () => document.removeEventListener("mousedown", handleClickOutside);
 }, [isOpen]);

 useEffect(() => {
 if (isCollapsed) setIsOpen(false);
 }, [isCollapsed]);

 return (
 <div ref={containerRef} className={s.userNavRoot}>
 {/* Dropdown card — floats above trigger, no layout shift */}
 {isOpen && (
 <div className={s.userNavDropdown}>
 <button className={s.userNavDropdownItem}>
 <User className="h-4 w-4 shrink-0" />
 <span>Account</span>
 </button>
 <button className={s.userNavDropdownItem} onClick={handleLogout}>
 <LogOut className="h-4 w-4 shrink-0" />
 <span>Log out</span>
 </button>
 </div>
 )}

 {/* Trigger — border-t keeps the separator line fixed at bottom */}
 <button
 onClick={() => !isCollapsed && setIsOpen((o) => !o)}
 className={cn(
 s.userNavTrigger,
 isCollapsed ? s.userNavTriggerCollapsed : s.userNavTriggerExpanded
 )}
 >
 <div className={s.userNavAvatar}>S</div>

 <div className={cn(s.userNavInfo, isCollapsed ? s.userNavInfoCollapsed : s.userNavInfoExpanded)}>
 <p className={s.userNavName}>shinoy</p>
 <p className={s.userNavCaption}>Account</p>
 </div>

 <ChevronDown
 className={cn(
 "h-4 w-4 text-slate-400 shrink-0 transition-all duration-300",
 isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-auto",
 isOpen && "rotate-180"
 )}
 />
 </button>
 </div>
 );
}