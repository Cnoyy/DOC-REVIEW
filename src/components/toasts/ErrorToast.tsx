import { toast } from "sonner";
import { XCircle } from "lucide-react";

export const showErrorToast = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 w-full min-w-[300px] p-4 rounded-xl bg-red-500 text-white shadow-lg border border-red-600">
        <XCircle className="w-5 h-5 text-white" />
        <span className="font-semibold text-sm">{message}</span>
      </div>
    ),
    { position: "top-center", duration: 2000 }
  );
};
