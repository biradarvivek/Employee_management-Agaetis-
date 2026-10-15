
import type { Employee } from "./api";

export const roleStyles: Record<string, string> = {
  designer: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100",
  engineer: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  developer: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  manager: "bg-amber-50 text-amber-700 ring-amber-100",
  marketing: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  product: "bg-sky-50 text-sky-700 ring-sky-100",
  hr: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function getAvatarColor(name: string): string {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-pink-100 text-pink-700",
    "bg-cyan-100 text-cyan-700",
  ];

  const index = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return colors[index % colors.length];
}

export function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getRoleStyle(role: string): string {
  const roleKey = role.toLowerCase();

  const matchedKey = Object.keys(roleStyles).find((key) =>
    roleKey.includes(key)
  );

  return matchedKey
    ? roleStyles[matchedKey]
    : "bg-slate-100 text-slate-600 ring-slate-200";
}

export function countUniqueRoles(employees: Employee[]): number {
  return new Set(
    employees.map((employee) => employee.role.trim().toLowerCase())
  ).size;
}
