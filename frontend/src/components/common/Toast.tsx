import { Check, X } from "lucide-react";

type ToastProps = {
  message: string;
  onDismiss: () => void;
};

export default function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div
      className="animate-rise-in fixed bottom-5 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-xl shadow-slate-900/10"
      role="status"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Check size={17} />
      </span>

      <p className="flex-1 text-sm font-semibold text-slate-700">
        {message}
      </p>

      <button
        aria-label="Dismiss notification"
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
        onClick={onDismiss}
        type="button"
      >
        <X size={15} />
      </button>
    </div>
  );
}