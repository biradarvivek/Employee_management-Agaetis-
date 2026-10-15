import { useState } from "react";
import {
  CircleAlert,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

import type { Employee } from "../../lib/api";

import {
  formatDate,
  getAvatarColor,
  getInitials,
  getRoleStyle,
} from "../../lib/employeeUtils";

type EmployeeDirectoryProps = {
  employees: Employee[];
  filteredEmployees: Employee[];
  loading: boolean;
  search: string;
  pageError: string;
  deletingId: number | null;
  onSearchChange: (value: string) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
  onRetry: () => void;
  onAddFirst: () => void;
};

export default function EmployeeDirectory({
  employees,
  filteredEmployees,
  loading,
  search,
  pageError,
  deletingId,
  onSearchChange,
  onEdit,
  onDelete,
  onRetry,
  onAddFirst,
}: EmployeeDirectoryProps) {
  const [sortByName, setSortByName] = useState(false);

  const visibleEmployees = sortByName
    ? [...filteredEmployees].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    : filteredEmployees;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-panel">
      {/* Table heading and search */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-slate-900">
              All employees
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {employees.length}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            A quick overview of everyone on your team.
          </p>
        </div>

        <div className="relative w-full sm:max-w-[310px]">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={17}
          />

          <input
            aria-label="Search employee by name"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder="Search by name..."
            type="search"
            value={search}
          />

          {search && (
            <button
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              onClick={() => onSearchChange("")}
              type="button"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* API error */}
      {pageError && (
        <div
          className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:mx-7"
          role="alert"
        >
          <CircleAlert className="mt-0.5 shrink-0" size={18} />

          <div className="min-w-0 flex-1">
            <p className="font-semibold">
              We couldn't complete that request
            </p>

            <p className="mt-1 text-rose-700">{pageError}</p>
          </div>

          <button
            className="shrink-0 rounded-lg px-3 py-1.5 font-semibold hover:bg-rose-100"
            onClick={onRetry}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      {/* Employee table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-400">
              <th className="px-7 py-4 font-bold">
                <button
                  className="inline-flex items-center gap-2"
                  onClick={() =>
                    setSortByName((current) => !current)
                  }
                  type="button"
                >
                  Employee <span aria-hidden="true">↕</span>
                </button>
              </th>

              <th className="px-5 py-4 font-bold">Job role</th>
              <th className="px-5 py-4 font-bold">Date added</th>
              <th className="px-5 py-4 text-right font-bold">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              Array.from({ length: 4 }, (_, index) => (
                <tr key={index}>
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

                      <div className="space-y-2">
                        <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
                        <div className="h-3 w-44 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="h-6 w-28 animate-pulse rounded-full bg-slate-100" />
                  </td>

                  <td className="px-5 py-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                  </td>

                  <td className="px-5 py-5">
                    <div className="ml-auto h-8 w-20 animate-pulse rounded-lg bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : visibleEmployees.length > 0 ? (
              visibleEmployees.map((employee) => (
                <tr
                  className="group transition-colors hover:bg-slate-50/70"
                  key={employee.id}
                >
                  <td className="px-7 py-5">
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] text-sm font-extrabold ${getAvatarColor(employee.name)}`}
                      >
                        {getInitials(employee.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {employee.name}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-slate-500">
                          <Mail
                            size={12}
                            className="shrink-0 text-slate-400"
                          />
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`inline-flex max-w-[190px] items-center truncate rounded-lg px-2.5 py-1.5 text-xs font-bold ring-1 ring-inset ${getRoleStyle(employee.role)}`}
                    >
                      {employee.role}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
                    {formatDate(employee.created_at)}
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        aria-label={`Edit ${employee.name}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-transparent px-3 text-xs font-bold text-slate-500 transition hover:border-indigo-100 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        onClick={() => onEdit(employee)}
                        type="button"
                      >
                        <Pencil size={14} /> Edit
                      </button>

                      <button
                        aria-label={`Delete ${employee.name}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-transparent px-3 text-xs font-bold text-slate-400 transition hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:opacity-50"
                        disabled={deletingId === employee.id}
                        onClick={() => onDelete(employee)}
                        type="button"
                      >
                        <Trash2 size={14} />
                        {deletingId === employee.id
                          ? "Deleting…"
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-16 text-center" colSpan={4}>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    {search ? <Search size={23} /> : <Users size={24} />}
                  </div>

                  <h3 className="mt-4 font-display text-base font-extrabold text-slate-800">
                    {search
                      ? "No matching employees"
                      : "Your directory is empty"}
                  </h3>

                  <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                    {search
                      ? `We couldn't find anyone with a name matching "${search}". Try a different search.`
                      : "Add your first employee to start building your team directory."}
                  </p>

                  {search ? (
                    <button
                      className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                      onClick={() => onSearchChange("")}
                      type="button"
                    >
                      Clear search
                    </button>
                  ) : (
                    <button
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
                      onClick={onAddFirst}
                      type="button"
                    >
                      <Plus size={16} /> Add first employee
                    </button>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p>
          Showing{" "}
          <span className="font-bold text-slate-600">
            {loading ? 0 : visibleEmployees.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-600">
            {employees.length}
          </span>{" "}
          employees
        </p>

        <p className="inline-flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Changes sync with your database
        </p>
      </div>
    </section>
  );
}