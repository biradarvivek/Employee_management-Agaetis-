import type { Request, Response } from "express";
import {
  EmployeeModel,
  type EmployeeInput,
} from "../models/employee.model.js";

function validateEmployee(body: unknown): EmployeeInput | null {
  if (!body || typeof body !== "object") return null;

  const data = body as Record<string, unknown>;

  if (
    typeof data.name !== "string" ||
    typeof data.email !== "string" ||
    typeof data.role !== "string"
  ) {
    return null;
  }

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const role = data.role.trim();

  if (
    !name ||
    !role ||
    name.length > 100 ||
    role.length > 100 ||
    email.length > 255 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return null;
  }

  return { name, email, role };
}

function handleError(res: Response, error: unknown): void {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ER_DUP_ENTRY"
  ) {
    res.status(409).json({
      message: "An employee with this email already exists",
    });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Internal server error" });
}

function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const getEmployees = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";

    const employees = await EmployeeModel.findAll(search);
    res.status(200).json(employees);
  } catch (error) {
    handleError(res, error);
  }
};

export const createEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  const employee = validateEmployee(req.body);

  if (!employee) {
    res.status(400).json({
      message: "Valid name, email, and role are required",
    });
    return;
  }

  try {
    const created = await EmployeeModel.create(employee);
    res.status(201).json(created);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  const idParam = req.params.id;
  const id = typeof idParam === "string" ? parseId(idParam) : null;
  const employee = validateEmployee(req.body);

  if (id === null) {
    res.status(400).json({ message: "Invalid employee ID" });
    return;
  }

  if (!employee) {
    res.status(400).json({
      message: "Valid name, email, and role are required",
    });
    return;
  }

  try {
    const existing = await EmployeeModel.findById(id);

    if (!existing) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    const updated = await EmployeeModel.update(id, employee);
    res.status(200).json(updated);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteEmployee = async (
  req: Request,
  res: Response
): Promise<void> => {
  const idParam = req.params.id;
  const id = typeof idParam === "string" ? parseId(idParam) : null;

  if (id === null) {
    res.status(400).json({ message: "Invalid employee ID" });
    return;
  }

  try {
    const deleted = await EmployeeModel.delete(id);

    if (!deleted) {
      res.status(404).json({ message: "Employee not found" });
      return;
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};