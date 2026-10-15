import { Trash2 } from "lucide-react";
import type { Employee } from "../../lib/api";

type DeleteEmployeeDialogProps = {
  employee: Employee;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteEmployeeDialog({
  employee,
  deleting,
  onCancel,
  onConfirm,
}: DeleteEmployeeDialogProps) {
  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]">
      <section
        aria-labelledby="delete-title"
        aria-modal="true"
        className="animate-rise-in w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl shadow-slate-950/20 sm:p-7"
        role="alertdialog"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <Trash2 size={21} />
        </div>

        <h2
          id="delete-title"
          className="mt-5 font-display text-xl font-extrabold tracking-tight text-slate-900"
        >
          Delete employee?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You&apos;re about to remove{" "}
          <span className="font-bold text-slate-700">
            {employee.name}
          </span>{" "}
          from the directory. This action cannot be undone.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
            disabled={deleting}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>

          <button
            className="rounded-xl bg-rose-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={deleting}
            onClick={onConfirm}
            type="button"
          >
            {deleting ? "Deleting…" : "Yes, delete employee"}
          </button>
        </div>
      </section>
    </div>
  );
}