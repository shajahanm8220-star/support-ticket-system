import pool from "../db";
import { RowDataPacket } from "mysql2";

export interface DashboardStats {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  recentTickets: RowDataPacket[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [countRows] = await pool.query<RowDataPacket[]>(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) AS open,
      SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS inProgress,
      SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved
    FROM tickets
  `);

  const [recentTickets] = await pool.query<RowDataPacket[]>(`
    SELECT
      t.id,
      c.name AS customer_name,
      t.subject,
      t.priority,
      t.status,
      t.created_at
    FROM tickets t
    INNER JOIN customers c
      ON c.id = t.customer_id
    ORDER BY t.created_at DESC
    LIMIT 5
  `);

  const stats = countRows[0];

  return {
    total: Number(stats.total || 0),
    open: Number(stats.open || 0),
    inProgress: Number(stats.inProgress || 0),
    resolved: Number(stats.resolved || 0),
    recentTickets,
  };
}