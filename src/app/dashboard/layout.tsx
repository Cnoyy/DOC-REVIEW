"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { layout as l, topbar as t } from "@/lib/theme";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
 const [isMobileOpen, setIsMobileOpen] = useState(false);

 return (
 <AuthGuard>
 <div className={l.dashboard}>
 <Sidebar
 isMobileOpen={isMobileOpen}
 onMobileClose={() => setIsMobileOpen(false)}
 />

 <div className={l.content}>
 {/* Mobile top bar */}
 <header className={t.root}>
 <button
 onClick={() => setIsMobileOpen(true)}
 className={t.menuBtn}
 aria-label="Open menu"
 >
 <Menu className="h-5 w-5" />
 </button>
 <span className={t.title}>DocuReview</span>
 </header>

 <main className={l.main}>
 {children}
 </main>
 </div>
 </div>
 </AuthGuard>
 );
}