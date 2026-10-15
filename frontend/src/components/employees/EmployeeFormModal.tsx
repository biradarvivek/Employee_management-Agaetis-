import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  CircleAlert,
  Mail,
  Pencil,
  UserRoundPlus,
  X,
} from "lucide-react";

import {
  getErrorMessage,
  type Employee,
  type EmployeeInput,
} from "../../lib/api";

type EmployeeFormModalProps = {
  employee: Employee | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeInput) => Promise<void>;
};

const emptyForm: EmployeeInput = {
  name: "",
  email: "",
  role: "",
};

export default function EmployeeFormModal({
  employee,
  saving,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) {
  const [form, setForm] = useState<EmployeeInput>(
    employee
      ? {
          name: employee.name,
          email: employee.email,
          role: employee.role,
        }
      : emptyForm
  );

  const [formError, setFormError] = useState("");

  const updateField = (field: keyof EmployeeInput, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const payload: EmployeeInput = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role.trim(),
    };

    if (!payload.name || !payload.email || !payload.role) {
      setFormError("Please fill in all three fields.");
      return;
    }

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <div
      className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="employee-form-title"
        aria-modal="true"
        className="animate-rise-in w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/20"
        role="dialog"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              {employee ? (
                <Pencil size={20} />
              ) : (
                <UserRoundPlus size={21} />
              )}
            </div>

            <h2
              id="employee-form-title"
              className="font-display text-xl font-extrabold tracking-tight text-slate-900"
            >
              {employee ? "Edit employee" : "Add a new employee"}
            </h2>

            <p className="mt-1.5 text-sm text-slate-500">
              {employee
                ? "Update their details below."
                : "Add someone new to your team directory."}
            </p>
          </div>

          <button
            aria-label="Close form"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            disabled={saving}
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="space-y-5 px-6 py-6 sm:px-8"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="employee-name"
            >
              Full name
            </label>

            <input
              autoComplete="name"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              id="employee-name"
              maxLength={100}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="e.g. Vivek Biradar"
              required
              value={form.name}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="employee-email"
            >
              Work email
            </label>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                id="employee-email"
                maxLength={255}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                placeholder="name@company.com"
                required
                type="email"
                value={form.email}
              />
            </div>
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="employee-role"
            >
              Job role
            </label>

            <div className="relative">
              <BriefcaseBusiness
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />

              <input
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                id="employee-role"
                maxLength={100}
                onChange={(event) =>
                  updateField("role", event.target.value)
                }
                placeholder="e.g. Frontend Developer"
                required
                value={form.role}
              />
            </div>
          </div>

          {formError && (
            <div
              className="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 px-3.5 py-3 text-sm text-rose-700"
              role="alert"
            >
              <CircleAlert
                className="mt-0.5 shrink-0"
                size={16}
              />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving
                ? "Saving…"
                : employee
                  ? "Save changes"
                  : "Add employee"}

              {!saving && <ArrowRight size={16} />}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}