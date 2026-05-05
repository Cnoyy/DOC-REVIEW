"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
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
  FileText,
  UserCheck,
} from "lucide-react";
import { layout as l } from "@/lib/theme";
import { useDocumentsLibraryQuery, useDeleteDocumentMutation } from "@/hooks/useDocumentsLibraryQuery";
import { DocumentLibraryItem, ReviewerStatus } from "@/types/documents-library";
import { Button } from "@/components/ui/button";
import SearchAndDateFilter from "@/components/dashboard/SearchAndDateFilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { showSuccessToast } from "@/components/toasts/SuccessToast";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { documents, loading, error } = useDocumentsLibraryQuery();
  const deleteMutation = useDeleteDocumentMutation();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  });
  
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    document: DocumentLibraryItem | null;
  }>({
    isOpen: false,
    document: null,
  });

  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, activeFilter, sortOrder, dateRange]);

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
    } else if (activeFilter !== "all") {
      result = result.filter((d) => d.reviewerStatus === activeFilter);
    }

    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter((d) => new Date(d.uploadedDate) >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((d) => new Date(d.uploadedDate) <= toDate);
    }

    result.sort((a, b) => {
      const da = new Date(a.uploadedDate).getTime();
      const db = new Date(b.uploadedDate).getTime();
      return sortOrder === "desc" ? db - da : da - db;
    });

    return result;
  }, [documents, search, activeFilter, sortOrder, dateRange]);

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
      setDeleteDialog({
        isOpen: true,
        document: doc,
      });
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteDialog.document) return;

    try {
      await deleteMutation.mutateAsync(deleteDialog.document.id);
      showSuccessToast('Document deleted successfully');
      setDeleteDialog({ isOpen: false, document: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [deleteDialog.document, deleteMutation]);

  const handleCancelDelete = useCallback(() => {
    setDeleteDialog({ isOpen: false, document: null });
  }, []);

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

  const handleDateRangeChange = useCallback((range: { from: string | null; to: string | null }) => {
    setDateRange(range);
  }, []);

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All", icon: <FileText className="h-3.5 w-3.5" /> },
    { key: "ai-suggested", label: "AI", icon: <Bot className="h-3.5 w-3.5" /> },
    { key: "reviewer-suggestion", label: "Suggestions", icon: <UserCheck className="h-3.5 w-3.5" /> },
    { key: "pending", label: "Pending", icon: <Clock className="h-3.5 w-3.5" /> },
    { key: "approved", label: "Approved", icon: <CheckCircle className="h-3.5 w-3.5" /> },
    { key: "rejected", label: "Rejected", icon: <XCircle className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className={l.page}>
      
      <SearchAndDateFilter
        search={search}
        onSearchChange={setSearch}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        placeholder="Search documents by name..."
      />

      <div className=" mb-6 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {filters.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-slate-800  rounded-t-lg text-slate-900 bg-slate-50"
                    : "border-transparent text-slate-500 hover:rounded-t-lg hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className={isActive ? "text-slate-800" : "text-slate-400"}>
                  {tab.icon}
                </span>
                {tab.label}
                <span
                  className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {documents.filter((doc) => {
                    if (tab.key === "all") return true;
                    if (tab.key === "ai-suggested") return doc.aiSuggested;
                    if (tab.key === "reviewer-suggestion") return doc.reviewerStatus === "reviewer-suggestion";
                    return doc.reviewerStatus === tab.key;
                  }).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-5 w-24 rounded-full" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
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
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => handleView(doc)}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownload(doc);
                                }}
                                title="Download"
                                className="flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(doc);
                                }}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Document"
        message={`Are you sure you want to delete "${deleteDialog.document?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
      />
    </div>
  );
}
