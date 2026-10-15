import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
  iconClassName: string;
  iconBackgroundClassName: string;
};

export default function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  iconClassName,
  iconBackgroundClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-panel sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-900">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconBackgroundClassName} ${iconClassName}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{helper}</p>
    </div>
  );
}