
import axios from "axios";

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface EmployeeInput {
  name: string;
  email: string;
  role: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export const employeeApi = {
  getAll: () => api.get<Employee[]>("/employees"),

  create: (data: EmployeeInput) =>
    api.post<Employee>("/employees", data),

  update: (id: number, data: EmployeeInput) =>
    api.put<Employee>(`/employees/${id}`, data),

  remove: (id: number) =>
    api.delete<{ message: string }>(`/employees/${id}`),
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.code === "ECONNABORTED") {
      return "The server took too long to respond. Please try again.";
    }

    if (!error.response) {
      return "Couldn't connect to the API. Make sure the backend is running on port 5000.";
    }
  }

  return "Something went wrong. Please try again.";
}
  