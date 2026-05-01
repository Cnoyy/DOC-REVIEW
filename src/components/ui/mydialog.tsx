"use client";

import * as React from "react";
import { X } from "lucide-react";

interface MyDialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function MyDialog({ open, onClose, children, className = "" }: MyDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl p-8 w-full max-w-2xl relative ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
