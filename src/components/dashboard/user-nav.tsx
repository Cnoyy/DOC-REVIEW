"use client";

import { useState } from "react";
import { ChevronDown, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface UserNavProps {
  isCollapsed?: boolean;
}

export function UserNav({ isCollapsed = false }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {!isCollapsed && (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full cursor-pointer items-center justify-start gap-3 bg-slate-600 py-3 px-4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 font-semibold text-slate-800">
            S
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">shinoy</p>
            <p className="text-xs text-gray-200">Account</p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-200 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </div>
      )}

      {isOpen && (
        <div className="absolute bottom-full left-2 right-2 mb-2 bg-slate-600 rounded-lg shadow-lg border border-slate-400 py-2">
          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors">
            <User className="h-4 w-4" />
            Account
          </button>
          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-white hover:bg-slate-700 transition-colors">
            Log out
          </button>
        </div>
      )}

      {isCollapsed && (
        <div className="absolute bottom-4 left-1/2 right-1/2 transform -translate-x-1/2 flex items-center justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-400">
            <User className="h-5 w-5 text-slate-800" />
          </div>
        </div>
      )}
    </div>
  );
}
