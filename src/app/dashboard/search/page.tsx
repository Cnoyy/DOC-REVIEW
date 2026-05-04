"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Clock, ChevronRight } from "lucide-react";
import { layout as l } from "@/lib/theme";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { useUploadPreloadStore } from "@/store/upload-preload-store";
import { SearchHistoryItem } from "@/types/search-history";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toUpperCase() || "DOC";
}

export default function SearchPage() {
  const router = useRouter();
  const { history, loading, error, fetchHistory } = useSearchHistory();
  const setPreload = useUploadPreloadStore((s) => s.setPreload);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleHistoryClick = (item: SearchHistoryItem) => {
    setPreload(
      {
        id: item.id,
        name: item.documentName,
        size: item.documentSize,
        type: item.documentType,
        uploaded: true,
      },
      item.aiSuggestion
    );
    router.push("/dashboard/upload");
  };

  return (
    <div className={l.page}>
      <div className="max-w-3xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Search History</h1>
          <p className="text-slate-500 text-sm">
            Previously analyzed documents — click any item to view its AI suggestion again.
          </p>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-100 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 text-red-600 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 text-center">
            <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No search history yet.</p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="space-y-3">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleHistoryClick(item)}
                className="w-full text-left bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 hover:shadow-md transition-all duration-150 group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 shrink-0">
                    <FileText className="h-5 w-5 text-indigo-500" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                      {item.documentName}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-400">
                        {getFileExtension(item.documentName)}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400">
                        {formatFileSize(item.documentSize)}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.searchedAt)}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
