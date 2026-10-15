import type { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../config/db.js";

export interface Employee extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: Date;
}

export interface EmployeeInput {
  name: string;
  email: string;
  role: string;
}

export const EmployeeModel = {
  async findAll(search = ""): Promise<Employee[]> {
    const [rows] = await pool.execute<Employee[]>(
      `SELECT id, name, email, role, created_at
       FROM employees
       WHERE name LIKE ?
       ORDER BY id DESC`,
      [`%${search}%`]
    );

    return rows;
  },

  async findById(id: number): Promise<Employee | undefined> {
    const [rows] = await pool.execute<Employee[]>(
      `SELECT id, name, email, role, created_at
       FROM employees WHERE id = ?`,
      [id]
    );

    return rows[0];
  },

  async create(data: EmployeeInput): Promise<Employee | undefined> {
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO employees (name, email, role)
       VALUES (?, ?, ?)`,
      [data.name, data.email, data.role]
    );

    return this.findById(result.insertId);
  },

  async update(
    id: number,
    data: EmployeeInput
  ): Promise<Employee | undefined> {
    await pool.execute<ResultSetHeader>(
      `UPDATE employees
       SET name = ?, email = ?, role = ?
       WHERE id = ?`,
      [data.name, data.email, data.role, id]
    );

    return this.findById(id);
  },

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM employees WHERE id = ?",
      [id]
    );

    return result.affectedRows > 0;
  },
};
