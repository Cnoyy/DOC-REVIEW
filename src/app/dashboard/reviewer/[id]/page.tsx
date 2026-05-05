"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  HardDrive,
  Bot,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Tag,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
  Clock,
} from "lucide-react";
import { layout as l } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { useReviewDocDetailQuery } from "@/hooks/useReviewDocumentsQuery";
import { useReviewActions } from "@/hooks/useReviewActions";
import { useAISuggestions } from "@/hooks/useAisuggestions";
import { showSuccessToast } from "@/components/toasts/SuccessToast";
import { showErrorToast } from "@/components/toasts/ErrorToast";
import { showValidationToast } from "@/components/toasts/ValidationToast";
import { formatAISuggestionAsReviewNote } from "@/mock/data/ai-suggestion";
import { ReviewStatus } from "@/types/review-documents";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG: Record<ReviewStatus, { label: string; className: string }> = {
  pending: { label: "Pending Review", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border border-red-200" },
  sent: { label: "Review Sent", className: "bg-indigo-50 text-indigo-700 border border-indigo-200" },
};

const TYPE_COLORS: Record<string, string> = {
  PDF: "bg-red-50 text-red-700 border border-red-200",
  DOCX: "bg-blue-50 text-blue-700 border border-blue-200",
  TXT: "bg-slate-100 text-slate-700 border border-slate-200",
};

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReviewerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const { detail, loading, error } = useReviewDocDetailQuery(documentId);
  const reviewActions = useReviewActions();
  const aiSuggestions = useAISuggestions();

  const [reviewNotes, setReviewNotes] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  
  useEffect(() => {
    if (detail?.contents) {
      const all: Record<number, boolean> = {};
      detail.contents.forEach((_, i) => { all[i] = true; });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedSections(all);
    }
  }, [detail]);

  const handleGenerateAI = useCallback(async () => {
    if (!detail) return;
    await aiSuggestions.fetchAISuggestions(detail.name);
  }, [detail, aiSuggestions]);

  useEffect(() => {
    if (aiSuggestions.suggestions) {
      const text = formatAISuggestionAsReviewNote(aiSuggestions.suggestions);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReviewNotes(text);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [aiSuggestions.suggestions]);

  const handleSendSuggestion = useCallback(async () => {
    if (!reviewNotes.trim()) {
      showValidationToast("Please write review notes before sending.");
      return;
    }
    setLoadingSend(true);
    try {
      const result = await reviewActions.sendSuggestion(documentId, reviewNotes);
      if (result?.success) {
        showSuccessToast(result.message || "Review suggestion sent to the submitter.");
        router.push("/dashboard/reviewer");
      } else {
        showErrorToast(result?.message || reviewActions.error || "Failed to send suggestion.");
      }
    } finally {
      setLoadingSend(false);
    }
  }, [documentId, reviewNotes, reviewActions, router]);

  const handleApprove = useCallback(async () => {
    setLoadingApprove(true);
    try {
      const result = await reviewActions.approveDocument(documentId, reviewNotes || undefined);
      if (result?.success) {
        showSuccessToast(result.message || "Document has been approved successfully.");
        router.push("/dashboard/reviewer");
      } else {
        showErrorToast(result?.message || reviewActions.error || "Failed to approve document.");
      }
    } finally {
      setLoadingApprove(false);
    }
  }, [documentId, reviewNotes, reviewActions, router]);

  const handleReject = useCallback(async () => {
    setLoadingReject(true);
    try {
      const result = await reviewActions.rejectDocument(documentId, reviewNotes || undefined);
      if (result?.success) {
        showErrorToast(result.message || "Document rejected. The submitter will be notified.");
        router.push("/dashboard/reviewer");
      } else {
        showErrorToast(result?.message || reviewActions.error || "Failed to reject document.");
      }
    } finally {
      setLoadingReject(false);
    }
  }, [documentId, reviewNotes, reviewActions, router]);

  const toggleSection = useCallback((idx: number) => {
    setExpandedSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }, []);

  if (loading) {
    return (
      <div className={l.page}>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex gap-5 mt-5 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex gap-6">
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Side panel skeleton */}
            <div className="w-80 flex-shrink-0 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <Skeleton className="h-5 w-32 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <Skeleton className="h-5 w-24 mb-3" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className={l.page}>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <AlertTriangle className="h-10 w-10 text-red-400" />
          <p className="text-sm text-red-600">{error || "Document not found."}</p>
          <button
            onClick={() => router.push("/dashboard/reviewer")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Review Documents
          </button>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[detail.status];
  const isPending = detail.status === "pending";

  return (
    <div className={l.page}>
      {/* Back navigation */}
      <button
        onClick={() => router.push("/dashboard/reviewer")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-5"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Review Documents
      </button>

      {/* Document header card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
              <FileText className="h-6 w-6 text-slate-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900 leading-tight break-words">{detail.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.className}`}>
                  {status.label}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${TYPE_COLORS[detail.documentType] ?? ""}`}>
                  {detail.documentType}
                </span>
                {detail.tags?.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500">
          <span className="flex items-center gap-2 shrink-0">
            <User className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">Submitted by <span className="font-medium text-slate-700 ml-1">{detail.submittedBy}</span></span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{new Date(detail.submittedDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </span>
          <span className="flex items-center gap-2 shrink-0">
            <HardDrive className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate">{detail.fileSize}</span>
          </span>
          
          {/* Approve / Reject buttons — only for pending, shown in meta section */}
          {isPending && (
            <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto mt-2 sm:mt-0">
              <Button
                onClick={handleApprove}
                disabled={loadingApprove || loadingReject || loadingSend}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 cursor-pointer bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                {loadingApprove ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={loadingApprove || loadingReject || loadingSend}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 cursor-pointer bg-red-600 text-white hover:bg-red-700 border border-red-600 rounded-xl px-4 py-2.5 text-sm font-medium"
              >
                {loadingReject ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Decline
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── PENDING layout ─────────────────────────────────────────── */}
      {isPending && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Document contents */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Document Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Document Contents
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {detail.contents.map((section, idx) => (
                  <div key={idx} className="px-6">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="flex items-center justify-between w-full py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-800">{section.section}</span>
                      {expandedSections[idx] ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSections[idx] && (
                      <p className="text-sm text-slate-600 leading-relaxed pb-4">{section.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Review notes */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                Review Notes
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Write your review notes
                </label>
                <textarea
                  ref={textareaRef}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Enter your review notes here, or click 'AI Suggestion Generate' to auto-fill..."
                  rows={10}
                  className="w-full px-4 py-3 text-sm bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 resize-y outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400 transition-colors leading-relaxed"
                />
                {aiSuggestions.error && (
                  <p className="text-xs text-red-600 mt-1">{aiSuggestions.error}</p>
                )}
              </div>

              {/* AI Suggestion Generate */}
              <Button
                onClick={handleGenerateAI}
                disabled={aiSuggestions.loading}
                className="w-full mb-2 flex items-center justify-center gap-2 cursor-pointer bg-slate-400 text-slate-700 hover:bg-slate-600 hover:text-white border border-slate-400 rounded-xl py-2.5"
              >
                {aiSuggestions.loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                    Generating AI Suggestion...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    AI Suggestion Generate
                  </>
                )}
              </Button>

              {/* Send Suggestion */}
              <Button
                onClick={handleSendSuggestion}
                disabled={loadingSend || loadingApprove || loadingReject}
                className="w-full flex items-center justify-center gap-2 cursor-pointer bg-slate-600 text-white hover:bg-slate-700 border border-slate-600 rounded-xl py-2.5"
              >
                {loadingSend ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Suggestion
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── APPROVED layout ────────────────────────────────────────── */}
      {detail.status === "approved" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Document contents */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Document Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Document Contents
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {detail.contents.map((section, idx) => (
                  <div key={idx} className="px-6">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="flex items-center justify-between w-full py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-800">{section.section}</span>
                      {expandedSections[idx] ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSections[idx] && (
                      <p className="text-sm text-slate-600 leading-relaxed pb-4">{section.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Approval card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-emerald-100 bg-emerald-50 rounded-t-2xl">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-emerald-800">Approval Details</span>
              </div>
              <div className="p-4 space-y-4">
                {detail.reviewerEmail && (
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Reviewed by</p>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-sm text-slate-700 truncate">{detail.reviewerEmail}</span>
                    </div>
                  </div>
                )}
                {detail.reviewedDate && (
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Approved on</span>
                      <span className="font-medium text-slate-700">{formatDateTime(detail.reviewedDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECTED layout ────────────────────────────────────────── */}
      {detail.status === "rejected" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Document contents */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Document Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Document Contents
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {detail.contents.map((section, idx) => (
                  <div key={idx} className="px-6">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="flex items-center justify-between w-full py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-800">{section.section}</span>
                      {expandedSections[idx] ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSections[idx] && (
                      <p className="text-sm text-slate-600 leading-relaxed pb-4">{section.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Rejection cards */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-red-100 bg-red-50 rounded-t-2xl">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-semibold text-red-800">Rejection Details</span>
              </div>
              <div className="p-4 space-y-4">
                {detail.reviewerEmail && (
                  <div className="space-y-2 pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rejected by</p>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                        <Mail className="h-3.5 w-3.5 text-red-600" />
                      </div>
                      <span className="text-sm text-slate-700 truncate">{detail.reviewerEmail}</span>
                    </div>
                  </div>
                )}
                {detail.reviewedDate && (
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Rejected on</span>
                      <span className="font-medium text-slate-700">{formatDateTime(detail.reviewedDate)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {detail.rejectionReason && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-semibold text-slate-700">Rejection Reason</span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-700 leading-relaxed">{detail.rejectionReason}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SENT REVIEWS layout ────────────────────────────────────── */}
      {detail.status === "sent" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Document contents */}
          <div className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                Document Overview
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{detail.description}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Document Contents
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {detail.contents.map((section, idx) => (
                  <div key={idx} className="px-6">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="flex items-center justify-between w-full py-4 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-800">{section.section}</span>
                      {expandedSections[idx] ? (
                        <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedSections[idx] && (
                      <p className="text-sm text-slate-600 leading-relaxed pb-4">{section.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Suggestion card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm">
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-indigo-100 bg-indigo-50 rounded-t-2xl">
                <Send className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-800">Review Suggestion</span>
              </div>
              <div className="p-4 space-y-4">
                {detail.suggesterEmail && (
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-3.5 w-3.5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Suggested by</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{detail.suggesterEmail}</p>
                    </div>
                  </div>
                )}
                {detail.suggestionDate && (
                  <div className="flex items-start gap-2 text-xs text-slate-500 pb-4 border-b border-slate-100">
                    <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Sent on</span>
                      <span className="font-medium text-slate-700">{formatDateTime(detail.suggestionDate)}</span>
                    </div>
                  </div>
                )}
                {detail.suggestionContent && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Suggestion</p>
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{detail.suggestionContent}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
