"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="sidebar"
      className={cn(
        "w-full justify-start gap-3 px-4 py-3 rounded-lg font-medium",
        isActive && "bg-slate-700 text-white"
      )}
      asChild
    >
      <Link href={href}>
        <Icon className="h-5 w-5" />
        {!isCollapsed && <span>{title}</span>}
      </Link>
    </Button>
  );
}
