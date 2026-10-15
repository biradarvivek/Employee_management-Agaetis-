// import express, { type Request, type Response } from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import pool from "./config/db.js";
// import type { ResultSetHeader, RowDataPacket } from "mysql2";

// dotenv.config();

// const app = express();
// const PORT = Number(process.env.PORT) || 5000;

// interface Employee extends RowDataPacket {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   created_at: Date;
// }

// interface EmployeeInput {
//   name: string;
//   email: string;
//   role: string;
// }

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173",
//   })
// );

// app.use(express.json());

// // Validate and normalize employee input.
// function validateEmployee(body: unknown): EmployeeInput | null {
//   if (!body || typeof body !== "object") {
//     return null;
//   }

//   const data = body as Record<string, unknown>;

//   if (
//     typeof data.name !== "string" ||
//     typeof data.email !== "string" ||
//     typeof data.role !== "string"
//   ) {
//     return null;
//   }

//   const name = data.name.trim();
//   const email = data.email.trim().toLowerCase();
//   const role = data.role.trim();

//   if (
//     !name ||
//     !email ||
//     !role ||
//     name.length > 100 ||
//     email.length > 255 ||
//     role.length > 100 ||
//     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//   ) {
//     return null;
//   }

//   return { name, email, role };
// }

// // Health check
// app.get("/", (_req: Request, res: Response) => {
//   res.json({ message: "Employee Directory API is running" });
// });

// // GET /employees - Fetch employees, with optional name search.
// app.get("/employees", async (req: Request, res: Response) => {
//   try {
//     const search =
//       typeof req.query.search === "string"
//         ? req.query.search.trim()
//         : "";

//     const [employees] = await pool.execute<Employee[]>(
//       `SELECT id, name, email, role, created_at
//        FROM employees
//        WHERE name LIKE ?
//        ORDER BY id DESC`,
//       [`%${search}%`]
//     );

//     res.status(200).json(employees);
//   } catch (error) {
//     console.error("Fetch employees error:", error);
//     res.status(500).json({ message: "Failed to fetch employees" });
//   }
// });

// // POST /employees - Create an employee.
// app.post("/employees", async (req: Request, res: Response) => {
//   const employee = validateEmployee(req.body);

//   if (!employee) {
//     res.status(400).json({
//       message: "Valid name, email, and role are required",
//     });
//     return;
//   }

//   try {
//     const [result] = await pool.execute<ResultSetHeader>(
//       `INSERT INTO employees (name, email, role)
//        VALUES (?, ?, ?)`,
//       [employee.name, employee.email, employee.role]
//     );

//     const [rows] = await pool.execute<Employee[]>(
//       `SELECT id, name, email, role, created_at
//        FROM employees WHERE id = ?`,
//       [result.insertId]
//     );

//     res.status(201).json(rows[0]);
//   } catch (error) {
//     if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
//       res.status(409).json({
//         message: "An employee with this email already exists",
//       });
//       return;
//     }

//     console.error("Create employee error:", error);
//     res.status(500).json({ message: "Failed to create employee" });
//   }
// });

// // PUT /employees/:id - Update an employee.
// app.put("/employees/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   const employee = validateEmployee(req.body);

//   if (!Number.isInteger(id) || id < 1) {
//     res.status(400).json({ message: "Invalid employee ID" });
//     return;
//   }

//   if (!employee) {
//     res.status(400).json({
//       message: "Valid name, email, and role are required",
//     });
//     return;
//   }

//   try {
//     const [result] = await pool.execute<ResultSetHeader>(
//       `UPDATE employees
//        SET name = ?, email = ?, role = ?
//        WHERE id = ?`,
//       [employee.name, employee.email, employee.role, id]
//     );

//     if (result.affectedRows === 0) {
//       const [rows] = await pool.execute<Employee[]>(
//         "SELECT id FROM employees WHERE id = ?",
//         [id]
//       );

//       if (rows.length === 0) {
//         res.status(404).json({ message: "Employee not found" });
//         return;
//       }
//     }

//     const [rows] = await pool.execute<Employee[]>(
//       `SELECT id, name, email, role, created_at
//        FROM employees WHERE id = ?`,
//       [id]
//     );

//     res.status(200).json(rows[0]);
//   } catch (error) {
//     if ((error as { code?: string }).code === "ER_DUP_ENTRY") {
//       res.status(409).json({
//         message: "An employee with this email already exists",
//       });
//       return;
//     }

//     console.error("Update employee error:", error);
//     res.status(500).json({ message: "Failed to update employee" });
//   }
// });

// // DELETE /employees/:id - Delete an employee.
// app.delete("/employees/:id", async (req: Request, res: Response) => {
//   const id = Number(req.params.id);

//   if (!Number.isInteger(id) || id < 1) {
//     res.status(400).json({ message: "Invalid employee ID" });
//     return;
//   }

//   try {
//     const [result] = await pool.execute<ResultSetHeader>(
//       "DELETE FROM employees WHERE id = ?",
//       [id]
//     );

//     if (result.affectedRows === 0) {
//       res.status(404).json({ message: "Employee not found" });
//       return;
//     }

//     res.status(200).json({ message: "Employee deleted successfully" });
//   } catch (error) {
//     console.error("Delete employee error:", error);
//     res.status(500).json({ message: "Failed to delete employee" });
//   }
// });

// // Start the server after verifying the database connection.
// async function startServer() {
//   try {
//     const connection = await pool.getConnection();
//     console.log("MySQL connected successfully");
//     connection.release();

//     app.listen(PORT, () => {
//       console.log(`Server running at http://localhost:${PORT}`);
//     });
//   } catch (error) {
//     console.error("Unable to connect to MySQL:", error);
//     process.exit(1);
//   }
// }

// startServer();


import dotenv from "dotenv";
import app from "./app.js";
import pool from "./config/db.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

async function startServer(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    connection.release();

    console.log("MySQL connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to MySQL:", error);
    process.exit(1);
  }
}

startServer();