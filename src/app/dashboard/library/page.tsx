"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Bot,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  FileText,
  UserCheck,
} from "lucide-react";
import { layout as l } from "@/lib/theme";
import { useDocumentsLibrary } from "@/hooks/useDocumentsLibrary";
import { DocumentLibraryItem, ReviewerStatus } from "@/types/documents-library";

const PAGE_SIZE = 5;

type FilterType = "all" | "ai-suggested" | "reviewer-suggestion" | "pending" | "approved" | "rejected";

const STATUS_CONFIG: Record<
  ReviewerStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
  },
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border border-red-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
  "reviewer-suggestion": {
    label: "Reviewer Suggestion",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    icon: <UserCheck className="h-3.5 w-3.5" />,
  },
};

const TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-50 text-red-700 border border-red-200",
  DOCX: "bg-blue-50 text-blue-700 border border-blue-200",
  TXT: "bg-slate-100 text-slate-700 border border-slate-200",
};

export default function LibraryPage() {
  const router = useRouter();
  const { documents, loading, error, fetchDocuments, deleteDocument } =
    useDocumentsLibrary();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeFilter, sortOrder]);

  const filtered = useMemo(() => {
    let result = [...documents];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q));
    }

    if (activeFilter === "ai-suggested") {
      result = result.filter((d) => d.aiSuggested);
    } else if (activeFilter === "reviewer-suggestion") {
      result = result.filter((d) => d.reviewerStatus === "reviewer-suggestion");
    } else if (activeFilter === "pending") {
      result = result.filter((d) => d.reviewerStatus === "pending" && !d.aiSuggested);
    } else if (activeFilter === "approved") {
      result = result.filter((d) => d.reviewerStatus === "approved" && !d.aiSuggested);
    } else if (activeFilter === "rejected") {
      result = result.filter((d) => d.reviewerStatus === "rejected" && !d.aiSuggested);
    }

    result.sort((a, b) => {
      const da = new Date(a.uploadedDate).getTime();
      const db = new Date(b.uploadedDate).getTime();
      return sortOrder === "desc" ? db - da : da - db;
    });

    return result;
  }, [documents, search, activeFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const showReviewerStatusCol = activeFilter !== "ai-suggested";
  const showAIBadge = activeFilter === "all" || activeFilter === "ai-suggested";

  const handleView = useCallback(
    (doc: DocumentLibraryItem) => {
      router.push(`/dashboard/library/${doc.id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (doc: DocumentLibraryItem) => {
      if (confirm(`Delete "${doc.name}"? This cannot be undone.`)) {
        deleteDocument(doc.id);
      }
    },
    [deleteDocument]
  );

  const handleDownload = useCallback((doc: DocumentLibraryItem) => {
    const content = `Document: ${doc.name}\nType: ${doc.type}\nUploaded: ${doc.uploadedDate}\nStatus: ${doc.reviewerStatus}\nUploaded by: ${doc.uploadedBy}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Documents", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "ai-suggested", label: "AI Suggested", icon: <Bot className="h-3.5 w-3.5" /> },
    { key: "reviewer-suggestion", label: "Reviewer Suggestion", icon: <UserCheck className="h-3.5 w-3.5" /> },
    { key: "pending", label: "Reviewer Pending", icon: <Clock className="h-3.5 w-3.5" /> },
    { key: "approved", label: "Approved", icon: <CheckCircle className="h-3.5 w-3.5" /> },
    { key: "rejected", label: "Rejected", icon: <XCircle className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className={l.page}>
      

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search documents by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-colors"
          />
        </div>

        <button
          onClick={() => setSortOrder((o) => (o === "desc" ? "asc" : "desc"))}
          className="flex items-center gap-2 h-10 px-4 text-sm font-medium bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          <Calendar className="h-4 w-4 text-slate-400" />
          Date: {sortOrder === "desc" ? "Newest first" : "Oldest first"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeFilter === f.key
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <p className="text-sm text-slate-500">Loading documents...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Document Name
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Uploaded Date
                    </th>
                    {showReviewerStatusCol && (
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Reviewer Status
                      </th>
                    )}
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={showReviewerStatusCol ? 5 : 4} className="text-center py-16 text-slate-400 text-sm">
                        <Filter className="h-8 w-8 mx-auto mb-3 opacity-40" />
                        No documents match your search or filters.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((doc) => {
                      const status = STATUS_CONFIG[doc.reviewerStatus];
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          {/* Document Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-slate-500" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-slate-800 truncate max-w-[200px]">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {doc.uploadedBy} · {doc.fileSize}
                                </p>
                              </div>
                              {showAIBadge && doc.aiSuggested && (
                                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  <Bot className="h-3 w-3" />
                                  AI
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Type */}
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                TYPE_COLORS[doc.type] ?? "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {doc.type}
                            </span>
                          </td>

                          {/* Uploaded Date */}
                          <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                            {new Date(doc.uploadedDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          {/* Reviewer Status — hidden for AI-suggested tab */}
                          {showReviewerStatusCol && (
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}
                              >
                                {status.icon}
                                {status.label}
                              </span>
                            </td>
                          )}

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleView(doc)}
                                title="View"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                              <button
                                onClick={() => handleDownload(doc)}
                                title="Download"
                                className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(doc)}
                                title="Delete"
                                className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-700">
                    {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–
                    {Math.min(currentPage * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-700">{filtered.length}</span>{" "}
                  documents
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                        page === currentPage
                          ? "bg-slate-800 text-white border border-slate-800"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {filtered.length > 0 && filtered.length <= PAGE_SIZE && (
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Showing all{" "}
                  <span className="font-medium text-slate-700">{filtered.length}</span>{" "}
                  document{filtered.length !== 1 ? "s" : ""}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
