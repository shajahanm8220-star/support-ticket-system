import pool from "../db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export interface TicketRow extends RowDataPacket {
  id: number;
  customer_id: number;
  agent_id: number | null;
  customer_name: string;
  customer_email: string;
  agent_name: string | null;
  subject: string;
  description: string;
  priority: string;
  category: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// =====================================================
// GET TICKETS
// Search + Filters + Sorting + Pagination
// =====================================================

export async function findTickets(
  search: string | undefined,
  status: string | undefined,
  priority: string | undefined,
  category: string | undefined,
  agentId: number | undefined,
  sort: string | undefined,
  limit: number,
  offset: number
): Promise<{ rows: TicketRow[]; total: number }> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  // Search
  if (search) {
    const searchValue = `%${search}%`;

    conditions.push(`
      (
        c.name LIKE ?
        OR c.email LIKE ?
        OR t.subject LIKE ?
      )
    `);

    values.push(
      searchValue,
      searchValue,
      searchValue
    );
  }

  // Status filter
  if (status) {
    conditions.push("t.status = ?");
    values.push(status);
  }

  // Priority filter
  if (priority) {
    conditions.push("t.priority = ?");
    values.push(priority);
  }

  // Category filter
  if (category) {
    conditions.push("t.category = ?");
    values.push(category);
  }

  // Agent filter
  if (agentId) {
    conditions.push("t.agent_id = ?");
    values.push(agentId);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // Sorting
  let orderBy = "t.created_at DESC";

  if (sort === "oldest") {
    orderBy = "t.created_at ASC";
  }

  if (sort === "priority") {
    orderBy = `
      CASE t.priority
        WHEN 'CRITICAL' THEN 1
        WHEN 'HIGH' THEN 2
        WHEN 'MEDIUM' THEN 3
        WHEN 'LOW' THEN 4
        ELSE 5
      END ASC,
      t.created_at DESC
    `;
  }

  // Get tickets
  const [rows] = await pool.query<TicketRow[]>(
    `
    SELECT
      t.id,
      t.customer_id,
      t.agent_id,
      c.name AS customer_name,
      c.email AS customer_email,
      a.name AS agent_name,
      t.subject,
      t.description,
      t.priority,
      t.category,
      t.status,
      t.created_at,
      t.updated_at
    FROM tickets t
    INNER JOIN customers c
      ON c.id = t.customer_id
    LEFT JOIN agents a
      ON a.id = t.agent_id
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
    `,
    [...values, limit, offset]
  );

  // Get total count
  const [countRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT COUNT(*) AS total
    FROM tickets t
    INNER JOIN customers c
      ON c.id = t.customer_id
    ${whereClause}
    `,
    values
  );

  return {
    rows,
    total: Number(countRows[0].total),
  };
}

// =====================================================
// GET ONE TICKET BY ID
// =====================================================

export async function findTicketById(
  id: number
): Promise<TicketRow | null> {
  const [rows] = await pool.query<TicketRow[]>(
    `
    SELECT
      t.id,
      t.customer_id,
      t.agent_id,
      c.name AS customer_name,
      c.email AS customer_email,
      a.name AS agent_name,
      t.subject,
      t.description,
      t.priority,
      t.category,
      t.status,
      t.created_at,
      t.updated_at
    FROM tickets t
    INNER JOIN customers c
      ON c.id = t.customer_id
    LEFT JOIN agents a
      ON a.id = t.agent_id
    WHERE t.id = ?
    `,
    [id]
  );

  return rows.length > 0 ? rows[0] : null;
}

// =====================================================
// UPDATE TICKET STATUS
// =====================================================

export async function updateTicketStatus(
  id: number,
  status: string
): Promise<boolean> {
  const [result] =
    await pool.execute<ResultSetHeader>(
      `
      UPDATE tickets
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

  return result.affectedRows > 0;
}

// =====================================================
// CREATE CUSTOMER
// =====================================================

export async function createCustomer(
  name: string,
  email: string
): Promise<number> {
  const [result] =
    await pool.execute<ResultSetHeader>(
      `
      INSERT INTO customers (name, email)
      VALUES (?, ?)
      `,
      [name, email]
    );

  return result.insertId;
}

// =====================================================
// CREATE TICKET
// =====================================================

export async function createTicket(
  customerId: number,
  subject: string,
  description: string,
  priority: string,
  category: string
): Promise<number> {
  const [result] =
    await pool.execute<ResultSetHeader>(
      `
      INSERT INTO tickets
      (
        customer_id,
        subject,
        description,
        priority,
        category
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        customerId,
        subject,
        description,
        priority,
        category,
      ]
    );

  return result.insertId;
}