import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BriefcaseBusiness,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import AppHeader from "./components/layout/AppHeader";
import StatCard from "./components/dashboard/StatCard";
import EmployeeDirectory from "./components/employees/EmployeeDirectory";
import EmployeeFormModal from "./components/employees/EmployeeFormModal";
import DeleteEmployeeDialog from "./components/employees/DeleteEmployeeDialog";
import Toast from "./components/common/Toast";

import {
  employeeApi,
  getErrorMessage,
  type Employee,
  type EmployeeInput,
} from "./lib/api";

import { countUniqueRoles } from "./lib/employeeUtils";

function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [dialogEmployee, setDialogEmployee] =
    useState<Employee | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [employeeToDelete, setEmployeeToDelete] =
    useState<Employee | null>(null);

  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");

  // Fetch employees from the backend.
  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  // Automatically dismiss success notifications.
  useEffect(() => {
    if (!notice) return;

    const timeout = window.setTimeout(() => {
      setNotice("");
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  // Filter employees by name.
  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return employees;

    return employees.filter((employee) =>
      employee.name.toLowerCase().includes(query)
    );
  }, [employees, search]);

  // Count the different job roles.
  const uniqueRoles = useMemo(
    () => countUniqueRoles(employees),
    [employees]
  );

  // Create a new employee or update an existing one.
  const handleSave = async (data: EmployeeInput) => {
    setSaving(true);
    setPageError("");

    try {
      if (dialogEmployee) {
        const response = await employeeApi.update(
          dialogEmployee.id,
          data
        );

        setEmployees((current) =>
          current.map((employee) =>
            employee.id === dialogEmployee.id
              ? response.data
              : employee
          )
        );

        setNotice("Employee details updated successfully.");
      } else {
        const response = await employeeApi.create(data);

        setEmployees((current) => [
          response.data,
          ...current,
        ]);

        setNotice("Employee added to your directory.");
      }

      setIsFormOpen(false);
      setDialogEmployee(null);
    } finally {
      setSaving(false);
    }
  };

  // Delete the selected employee.
  const handleDelete = async () => {
    if (!employeeToDelete) return;

    setDeletingId(employeeToDelete.id);
    setPageError("");

    try {
      await employeeApi.remove(employeeToDelete.id);

      setEmployees((current) =>
        current.filter(
          (employee) => employee.id !== employeeToDelete.id
        )
      );

      setNotice(
        `${employeeToDelete.name} was removed from the directory.`
      );

      setEmployeeToDelete(null);
    } catch (error) {
      setPageError(getErrorMessage(error));
      setEmployeeToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateForm = () => {
    setDialogEmployee(null);
    setIsFormOpen(true);
  };

  const openEditForm = (employee: Employee) => {
    setDialogEmployee(employee);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      <AppHeader />

      <main className="mx-auto max-w-[1440px] px-4 pb-12 pt-8 sm:px-7 sm:pt-10 lg:px-10 lg:pt-12">
        {/* Page heading */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:mb-9 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <Sparkles size={13} />
              Your people, all in one place
            </div>

            <h1 className="font-display text-3xl font-extrabold tracking-[-0.045em] text-slate-950 sm:text-[39px]">
              Employee directory
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Keep your team organized. View employee details
              and manage records in one simple workspace.
            </p>
          </div>

          <button
            className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
            onClick={openCreateForm}
            type="button"
          >
            <Plus size={18} strokeWidth={2.6} />
            Add employee
          </button>
        </section>

        {/* Dashboard statistics */}
        <section
          aria-label="Directory overview"
          className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatCard
            label="Total employees"
            value={employees.length}
            helper="Live directory count"
            icon={Users}
            iconClassName="text-indigo-600"
            iconBackgroundClassName="bg-indigo-50"
          />

          <StatCard
            label="Different roles"
            value={uniqueRoles}
            helper="Roles represented in your team"
            icon={BriefcaseBusiness}
            iconClassName="text-sky-600"
            iconBackgroundClassName="bg-sky-50"
          />

          <StatCard
            label="Matching employees"
            value={filteredEmployees.length}
            helper="Based on the current search"
            icon={Search}
            iconClassName="text-amber-600"
            iconBackgroundClassName="bg-amber-50"
          />
        </section>

        {/* Employee list */}
        <EmployeeDirectory
          employees={employees}
          filteredEmployees={filteredEmployees}
          loading={loading}
          search={search}
          pageError={pageError}
          deletingId={deletingId}
          onSearchChange={setSearch}
          onEdit={openEditForm}
          onDelete={setEmployeeToDelete}
          onRetry={() => void loadEmployees()}
          onAddFirst={openCreateForm}
        />

        <footer className="mt-7 flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
          <p>
            {new Date().getFullYear()} PeopleDesk
            <span className="mx-1.5 text-slate-300">•</span>
            Employee management, made simple.
          </p>

          <p className="flex items-center gap-1.5">
            <ShieldCheck size={13} />
            Internal team workspace
          </p>
        </footer>
      </main>

      {/* Success notification */}
      {notice && (
        <Toast
          message={notice}
          onDismiss={() => setNotice("")}
        />
      )}

      {/* Add/edit modal */}
      {isFormOpen && (
        <EmployeeFormModal
          employee={dialogEmployee}
          onClose={() => {
            setIsFormOpen(false);
            setDialogEmployee(null);
          }}
          onSubmit={handleSave}
          saving={saving}
        />
      )}

      {/* Delete confirmation */}
      {employeeToDelete && (
        <DeleteEmployeeDialog
          employee={employeeToDelete}
          deleting={deletingId === employeeToDelete.id}
          onCancel={() => setEmployeeToDelete(null)}
          onConfirm={() => void handleDelete()}
        />
      )}
    </div>
  );
}

export default App;