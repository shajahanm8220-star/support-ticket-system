import pool from "../db";
import { RowDataPacket } from "mysql2";

export interface AgentRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  department: string;
  status: string;
}

export async function findAgents(): Promise<AgentRow[]> {
  const [rows] = await pool.query<AgentRow[]>(
    `
    SELECT
      id,
      name,
      email,
      department,
      status
    FROM agents
    ORDER BY name ASC
    `
  );

  return rows;
}