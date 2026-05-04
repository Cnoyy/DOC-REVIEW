"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  User,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { layout as l } from "@/lib/theme";
import { useReviewDocumentsQuery } from "@/hooks/useReviewDocumentsQuery";
import { ReviewDocument, ReviewStatus } from "@/types/review-documents";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import SearchAndDateFilter from "@/components/dashboard/SearchAndDateFilter";
import { Skeleton } from "@/components/ui/skeleton";

const TABS: { key: ReviewStatus; label: string; icon: React.ReactNode }[] = [
  { key: "pending", label: "Pending", icon: <Clock className="h-4 w-4" /> },
  { key: "approved", label: "Approved", icon: <CheckCircle className="h-4 w-4" /> },
  { key: "rejected", label: "Rejected", icon: <XCircle className="h-4 w-4" /> },
  { key: "sent", label: "Sent Reviews", icon: <Send className="h-4 w-4" /> },
];

const TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-50 text-red-700 border border-red-200",
  DOCX: "bg-blue-50 text-blue-700 border border-blue-200",
  TXT: "bg-slate-100 text-slate-700 border border-slate-200",
};

const STATUS_DOT: Record<ReviewStatus, string> = {
  pending: "bg-amber-400",
  approved: "bg-emerald-500",
  rejected: "bg-red-500",
  sent: "bg-indigo-500",
};

function ReviewerPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as ReviewStatus) || "pending";

  const { documents, loading, error } = useReviewDocumentsQuery();

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({
    from: null,
    to: null,
  });

  
  const counts = useMemo(
    () => ({
      pending: documents.filter((d) => d.status === "pending").length,
      approved: documents.filter((d) => d.status === "approved").length,
      rejected: documents.filter((d) => d.status === "rejected").length,
      sent: documents.filter((d) => d.status === "sent").length,
    }),
    [documents]
  );

  const filtered = useMemo(() => {
    let result = documents.filter((d) => d.status === activeTab);

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q));
    }

    // Date range filter
    if (dateRange.from) {
      const fromDate = new Date(dateRange.from);
      result = result.filter((d) => new Date(d.submittedDate) >= fromDate);
    }
    if (dateRange.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((d) => new Date(d.submittedDate) <= toDate);
    }

    // Sort by date
    result.sort((a, b) => {
      const da = new Date(a.submittedDate).getTime();
      const db = new Date(b.submittedDate).getTime();
      return sortOrder === "desc" ? db - da : da - db;
    });

    return result;
  }, [documents, activeTab, search, dateRange, sortOrder]);

  const handleDateRangeChange = useCallback((range: { from: string | null; to: string | null }) => {
    setDateRange(range);
  }, []);

  const setTab = (tab: ReviewStatus) => {
    router.push(`/dashboard/reviewer?tab=${tab}`);
  };

  return (
    <div className={l.page}>
     
      <SearchAndDateFilter
        search={search}
        onSearchChange={setSearch}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        placeholder="Search review documents..."
      />

      <div className=" mb-6 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? "border-slate-800 rounded-t-lg text-slate-900 bg-slate-50"
                    : "border-transparent text-slate-500  hover:rounded-t-lg hover:text-slate-700 hover:bg-slate-50"
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
                  {counts[tab.key]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <FileText className="h-10 w-10 text-slate-300" />
          <p className="text-base font-medium text-slate-500">No documents in this category</p>
          <p className="text-sm text-slate-400">Documents will appear here once they are assigned.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              isPending={activeTab === "pending"}
              onOpen={() => router.push(`/dashboard/reviewer/${doc.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentCard({
  doc,
  isPending,
  onOpen,
}: {
  doc: ReviewDocument;
  isPending: boolean;
  onOpen: () => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-slate-300 hover:shadow-md transition-all duration-200 ${
        !isPending ? "cursor-pointer" : ""
      }`}
      onClick={!isPending ? onOpen : undefined}
    >
      {/* Icon + Status dot */}
      <div className="relative flex-shrink-0">
        <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-slate-500" />
        </div>
        <span
          className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${STATUS_DOT[doc.status]}`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-slate-800 truncate">{doc.name}</h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              TYPE_COLORS[doc.documentType] ?? "bg-slate-100 text-slate-600"
            }`}
          >
            {doc.documentType}
          </span>
        </div>

        <p className="text-sm text-slate-500 line-clamp-1 mb-2">{doc.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5" />
            Submitted by{" "}
            <span className="font-medium text-slate-600 ml-1">{doc.submittedBy}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(doc.submittedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="text-slate-300">{doc.fileSize}</span>
        </div>
      </div>

      {/* Action — only for pending */}
      {isPending && (
        <div className="flex-shrink-0">
          <button
            onClick={onOpen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Open for Review
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReviewerPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    >
      <ReviewerPageInner />
    </Suspense>
  );
}
