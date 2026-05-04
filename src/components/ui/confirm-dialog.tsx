"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-xl border border-slate-200 shadow-lg p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        
        {/* Message */}
        <div className="mb-6">
          <p className="text-sm text-slate-600">{message}</p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="mycancel"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer"
          >
            {cancelText}
          </Button>
          <Button
            variant="mybutton"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 border-red-600 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
