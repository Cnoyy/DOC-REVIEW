"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  Plus,
  AlertTriangle,
  BookOpen,
  Lightbulb,
  User,
  Calendar,
  HardDrive,
  UserCheck,
  Sparkles,
  Mail,
} from "lucide-react";
import { layout as l } from "@/lib/theme";
import { Button } from "@/components/ui/button";
import { MyDialog } from "@/components/ui/mydialog";
import { useDocumentDetail } from "@/hooks/useDocumentDetail";
import { useSendToReviewer } from "@/hooks/useSendToReviewer";
import { DocumentDetail } from "@/types/documents-library";
import { showSuccessToast } from "@/components/toasts/SuccessToast";
import { showErrorToast } from "@/components/toasts/ErrorToast";
import { showValidationToast } from "@/components/toasts/ValidationToast";
import { reviewerEmailSchema } from "@/validation/auth";

type ViewType = "reviewer-suggestion" | "ai-suggested" | "pending" | "approved" | "rejected";

function getViewType(detail: DocumentDetail): ViewType {
  if (detail.reviewerStatus === "reviewer-suggestion") return "reviewer-suggestion";
  if (detail.aiSuggested) return "ai-suggested";
  if (detail.reviewerStatus === "pending") return "pending";
  if (detail.reviewerStatus === "approved") return "approved";
  return "rejected";
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Library
    </button>
  );
}

function MetaRow({ detail }: { detail: DocumentDetail }) {
  return (
    <div className="flex flex-wrap gap-5 mt-5 pt-5 border-t border-slate-100">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <User className="h-4 w-4 text-slate-400" />
        <span>
          Uploaded by <span className="font-medium text-slate-700">{detail.uploadedBy}</span>
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Calendar className="h-4 w-4 text-slate-400" />
        <span>
          Uploaded{" "}
          <span className="font-medium text-slate-700">
            {new Date(detail.uploadedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <HardDrive className="h-4 w-4 text-slate-400" />
        <span className="font-medium text-slate-700">{detail.fileSize}</span>
      </div>
    </div>
  );
}

function DocContentPanel({ content, name }: { content: string; name: string }) {
  const fallback = `${name}\n\nDocument content is not available for preview.\nPlease download the file to view its contents.`;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 min-w-0 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
        <FileText className="h-4 w-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-700">Document</span>
        <span className="ml-auto text-xs text-slate-400">{name}</span>
      </div>
      <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
        <pre className="text-sm text-slate-700 font-mono leading-relaxed whitespace-pre-wrap break-words">
          {content || fallback}
        </pre>
      </div>
    </div>
  );
}

// ─── Reviewer Suggestion View ─────────────────────────────────────────────────

function ReviewerSuggestionView({ detail }: { detail: DocumentDetail }) {
  const rs = detail.reviewerSuggestions;
  return (
    <div className="flex gap-6 items-start">
      <DocContentPanel content={detail.documentContent ?? ""} name={detail.name} />
      <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
          <UserCheck className="h-4 w-4 text-indigo-500" />
          <span className="text-sm font-semibold text-slate-700">Reviewer Suggestions</span>
        </div>
        <div className="p-4 space-y-3">
          {rs ? (
            <>
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{rs.reviewer}</p>
                  <p className="text-xs text-slate-500">{rs.email}</p>
                </div>
              </div>
              {rs.items.map((item, i) => (
                <div key={i} className="rounded-xl bg-indigo-50 border border-indigo-100 p-3">
                  <p className="text-xs font-semibold text-indigo-700 mb-1.5">{item.section}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.suggestion}</p>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">No suggestions available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AI Suggested View ────────────────────────────────────────────────────────

function AISuggestedView({ detail }: { detail: DocumentDetail }) {
  const PRIORITY_BADGE: Record<string, string> = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100 text-green-700",
  };
  const PRIORITY_ROW: Record<string, string> = {
    high: "bg-red-50 border-red-200",
    medium: "bg-yellow-50 border-yellow-200",
    low: "bg-green-50 border-green-200",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-800">Document Summary</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{detail.summary}</p>
        </div>

        {detail.riskFlags.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h2 className="text-base font-semibold text-slate-800">Risk Flags</h2>
              <span className="ml-auto text-xs text-slate-400">
                {detail.riskFlags.length} flag{detail.riskFlags.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-2">
              {detail.riskFlags.map((flag, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 rounded-xl border text-sm ${PRIORITY_ROW[flag.priority]}`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`flex-shrink-0 mt-0.5 text-xs font-medium px-2 py-0.5 rounded ${PRIORITY_BADGE[flag.priority]}`}>
                      {flag.priority.charAt(0).toUpperCase() + flag.priority.slice(1)}
                    </span>
                    <span className="text-slate-700">{flag.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {detail.recommendations.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-semibold text-slate-800">Recommendations</h2>
            </div>
            <ul className="space-y-2">
              {detail.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="flex-shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pending View ─────────────────────────────────────────────────────────────

function PendingView({
  detail,
  onSendAgain,
}: {
  detail: DocumentDetail;
  onSendAgain: () => void;
}) {
  return (
    <div className="flex gap-6 items-start">
      <DocContentPanel content={detail.documentContent ?? ""} name={detail.name} />
      <div className="w-80 flex-shrink-0">
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-amber-100 bg-amber-50 rounded-t-2xl">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Pending Review</span>
          </div>
          <div className="p-4 space-y-3">
            {detail.reviewerEmails.length > 0 && (
              <>
                <p className="text-xs text-slate-500">Currently sent to:</p>
                <ul className="space-y-2">
                  {detail.reviewerEmails.map((email, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-50 rounded-lg border border-amber-100"
                    >
                      <Mail className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                      <span className="text-xs text-slate-700 truncate">{email}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            <Button
              variant="mybutton"
              onClick={onSendAgain}
              className="w-full flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              Send to More Reviewers
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Approved View ────────────────────────────────────────────────────────────

function ApprovedView({ detail }: { detail: DocumentDetail }) {
  return (
    <div className="flex gap-6 items-start">
      <DocContentPanel content={detail.documentContent ?? ""} name={detail.name} />
      <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-emerald-200 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-emerald-100 bg-emerald-50 rounded-t-2xl">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-800">Approval Details</span>
        </div>
        <div className="p-4 space-y-4">
          {detail.reviewerEmails.length > 0 && (
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Reviewed by</p>
              {detail.reviewerEmails.map((email, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700 truncate">{email}</span>
                </div>
              ))}
            </div>
          )}
          {detail.lastReviewedDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Approved on{" "}
              <span className="font-medium text-slate-700">
                {new Date(detail.lastReviewedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Rejected View ────────────────────────────────────────────────────────────

function RejectedView({ detail }: { detail: DocumentDetail }) {
  return (
    <div className="flex gap-6 items-start">
      <DocContentPanel content={detail.documentContent ?? ""} name={detail.name} />
      <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-red-200 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-red-100 bg-red-50 rounded-t-2xl">
          <XCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm font-semibold text-red-800">Rejection Details</span>
        </div>
        <div className="p-4 space-y-4">
          {detail.reviewerEmails.length > 0 && (
            <div className="space-y-2 pb-4 border-b border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Reviewed by</p>
              {detail.reviewerEmails.map((email, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <User className="h-3.5 w-3.5 text-red-600" />
                  </div>
                  <span className="text-sm text-slate-700 truncate">{email}</span>
                </div>
              ))}
            </div>
          )}
          {detail.lastReviewedDate && (
            <div className="flex items-center gap-2 text-xs text-slate-500 pb-3 border-b border-slate-100">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Rejected on{" "}
              <span className="font-medium text-slate-700">
                {new Date(detail.lastReviewedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {detail.notes && (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Rejection Reason
              </p>
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-sm text-slate-700 leading-relaxed">{detail.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Header badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<
  string,
  { label: string; className: string; icon: React.ReactNode }
> = {
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: <CheckCircle className="h-4 w-4" />,
  },
  pending: {
    label: "Reviewer Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: <Clock className="h-4 w-4" />,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border border-red-200",
    icon: <XCircle className="h-4 w-4" />,
  },
  "reviewer-suggestion": {
    label: "Reviewer Suggestion",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    icon: <UserCheck className="h-4 w-4" />,
  },
};

// ─── Send to Reviewer Dialog ──────────────────────────────────────────────────

function SendToReviewerDialog({
  open,
  onClose,
  documentName,
  reviewerEmails,
  emailErrors,
  onEmailChange,
  onAddEmail,
  onSend,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  documentName: string;
  reviewerEmails: string[];
  emailErrors: string[];
  onEmailChange: (index: number, value: string) => void;
  onAddEmail: () => void;
  onSend: () => void;
  loading: boolean;
}) {
  return (
    <MyDialog open={open} onClose={onClose}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Send to Reviewer</h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Enter reviewer email addresses to send{" "}
          <span className="font-medium text-slate-800">{documentName}</span> for reviewing
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {reviewerEmails.map((email, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter reviewer email"
                value={email}
                onChange={(e) => onEmailChange(index, e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  emailErrors[index]
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:ring-slate-500"
                }`}
              />
              {emailErrors[index] && (
                <p className="text-red-500 text-xs mt-1">{emailErrors[index]}</p>
              )}
            </div>
            {index === reviewerEmails.length - 1 && (
              <button
                onClick={onAddEmail}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-500 text-white hover:bg-slate-600 transition-colors cursor-pointer"
                title="Add more reviewers"
              >
                <Plus className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <Button
          variant="mycancel"
          className="py-3 text-base flex items-center justify-center gap-2 cursor-pointer px-6"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="mybutton"
          className="py-3 text-base flex items-center justify-center gap-2 cursor-pointer px-6"
          onClick={onSend}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send
            </>
          )}
        </Button>
      </div>
    </MyDialog>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const { detail, loading, error, fetchDocumentDetail } = useDocumentDetail();
  const sendToReviewer = useSendToReviewer();

  const [showReviewerDialog, setShowReviewerDialog] = useState(false);
  const [reviewerEmails, setReviewerEmails] = useState<string[]>([""]);
  const [emailErrors, setEmailErrors] = useState<string[]>([""]);

  useEffect(() => {
    if (documentId) {
      fetchDocumentDetail(documentId);
    }
  }, [documentId, fetchDocumentDetail]);

  const handleAddReviewerEmail = useCallback(() => {
    setReviewerEmails((prev) => [...prev, ""]);
    setEmailErrors((prev) => [...prev, ""]);
  }, []);

  const handleReviewerEmailChange = useCallback((index: number, value: string) => {
    setReviewerEmails((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    const result = reviewerEmailSchema.safeParse(value);
    setEmailErrors((prev) => {
      const next = [...prev];
      next[index] =
        !result.success && value !== ""
          ? result.error.issues?.[0]?.message || "Please enter a valid email address"
          : "";
      return next;
    });
  }, []);

  const handleReviewerSent = useCallback(async () => {
    const validEmails = reviewerEmails.filter((e) => e.trim() !== "");
    const hasErrors = emailErrors.some((e) => e !== "");

    if (validEmails.length === 0) {
      showValidationToast("Please enter at least one reviewer email");
      return;
    }
    if (hasErrors) {
      showValidationToast("Please fix email validation errors");
      return;
    }

    try {
      const result = await sendToReviewer.sendToReviewer(
        validEmails,
        documentId,
        "Please review this document"
      );
      if (result?.success) {
        setShowReviewerDialog(false);
        showSuccessToast(result.message);
        setReviewerEmails([""]);
        setEmailErrors([""]);
        sendToReviewer.clearResponse();
        router.push("/dashboard/library");
      } else {
        showErrorToast(
          result?.message || sendToReviewer.error || "Failed to send document to reviewers"
        );
      }
    } catch {
      showErrorToast("Failed to send document to reviewers");
    }
  }, [reviewerEmails, emailErrors, documentId, sendToReviewer, router]);

  const handleOpenDialog = useCallback(() => {
    setReviewerEmails([""]);
    setEmailErrors([""]);
    sendToReviewer.clearResponse();
    setShowReviewerDialog(true);
  }, [sendToReviewer]);

  if (loading) {
    return (
      <div className={l.page}>
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-sm text-slate-500">Loading document details...</p>
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
            onClick={() => router.push("/dashboard/library")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  const viewType = getViewType(detail);
  const statusBadge = STATUS_BADGE[detail.reviewerStatus] ?? STATUS_BADGE.pending;

  return (
    <div className={l.page}>
      <div className="mb-6">
        <BackButton onClick={() => router.push("/dashboard/library")} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-slate-500" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 leading-tight">{detail.name}</h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}
                  >
                    {statusBadge.icon}
                    {statusBadge.label}
                  </span>
                  {detail.aiSuggested && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
                      <Sparkles className="h-3 w-3" />
                      AI Suggested
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                    {detail.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <MetaRow detail={detail} />
        </div>
      </div>

      {viewType === "reviewer-suggestion" && <ReviewerSuggestionView detail={detail} />}
      {viewType === "ai-suggested" && <AISuggestedView detail={detail} />}
      {viewType === "pending" && (
        <PendingView detail={detail} onSendAgain={handleOpenDialog} />
      )}
      {viewType === "approved" && <ApprovedView detail={detail} />}
      {viewType === "rejected" && <RejectedView detail={detail} />}

      <SendToReviewerDialog
        open={showReviewerDialog}
        onClose={() => setShowReviewerDialog(false)}
        documentName={detail.name}
        reviewerEmails={reviewerEmails}
        emailErrors={emailErrors}
        onEmailChange={handleReviewerEmailChange}
        onAddEmail={handleAddReviewerEmail}
        onSend={handleReviewerSent}
        loading={sendToReviewer.loading}
      />
    </div>
  );
}
