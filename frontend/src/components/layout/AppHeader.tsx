import { ChevronDown, Users } from "lucide-react";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/75 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-7 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <Users size={21} strokeWidth={2.3} />
          </div>

          <div>
            <p className="font-display text-[17px] font-extrabold tracking-tight text-slate-900">
              People<span className="text-indigo-600">Desk</span>
            </p>
            <p className="-mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">
              TEAM DIRECTORY
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-emerald-700">
            Workspace
          </span>
          <ChevronDown className="text-emerald-700" size={14} />
        </div>
      </div>
    </header>
  );
}