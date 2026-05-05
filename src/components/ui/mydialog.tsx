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
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999] p-4">
      <div className={`bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg md:max-w-2xl relative mx-auto ${className}`}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
