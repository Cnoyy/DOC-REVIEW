"use client";

import { UploadCloud, Paperclip, FileText, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-700">
            Upload Documents
          </h1>
          <p className="text-slate-600 mt-1">
            Upload a document for AI review or send it to a reviewer
          </p>
        </div>
        <Button variant="ghost" size="icon">
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </Button>
      </div>

      {/* Upload Area */}
      <div className="max-w-4xl">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-600 transition-colors">
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloud className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-slate-600 mb-6">
              Drop your document here or click browse below
            </p>

            {/* File Type Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="mybutton" className="px-6 py-2">
                <Paperclip className="h-4 w-4 mr-2" />
                Browse file
              </Button>
              <Button variant="mycancel" className="px-6 py-2">
                PDF
              </Button>
              <Button variant="mycancel" className="px-6 py-2">
                DOCX
              </Button>
              <Button variant="mycancel" className="px-6 py-2">
                TXT
              </Button>
            </div>
          </div>
        </div>

        {/* Powered by Claude */}
        <div className="flex items-center justify-center gap-2 mt-6 text-slate-500">
          <div className="h-5 w-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-sm">Powered by Claude</span>
        </div>
      </div>
    </div>
  );
}
