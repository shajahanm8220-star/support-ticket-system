export type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export type Category =
  | "TECHNICAL"
  | "BILLING"
  | "ACCOUNT"
  | "GENERAL";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface Ticket {
  id: number;
  customer_id: number;
  agent_id: number | null;

  customer_name: string;
  customer_email: string;

  agent_name: string | null;

  subject: string;
  description: string;

  priority: Priority;
  category: Category;
  status: TicketStatus;

  created_at: string;
  updated_at: string;
}

export interface TicketListResponse {
  data: Ticket[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateTicketInput {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  priority: Priority;
  category: Category;
}