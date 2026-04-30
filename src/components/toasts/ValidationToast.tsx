import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

export const showValidationToast = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 w-full min-w-[300px] p-4 rounded-xl bg-red-100 text-red-700 shadow-lg border border-red-200">
        <AlertCircle className="w-5 h-5 text-red-700" />
        <span className="font-semibold text-sm">{message}</span>
      </div>
    ),
    { position: "top-center", duration: 2000 }
  );
};
