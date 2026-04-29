import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const showSuccessToast = (message: string) => {
  toast.custom(
    (t) => (
      <div className="flex items-center gap-3 w-full min-w-[300px] p-4 rounded-xl bg-green-500 text-white shadow-lg border border-green-600">
        <CheckCircle2 className="w-5 h-5 text-white" />
        <span className="font-semibold text-sm">{message}</span>
      </div>
    ),
    { position: "top-center", duration: 4000 }
  );
};
