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

export interface CreateTicketInput {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  priority: Priority;
  category: Category;
}

export interface TicketQuery {
  page: number;
  limit: number;
  search?: string;
  status?: TicketStatus;
  priority?: Priority;
  category?: Category;
  agentId?: number;
  sort?: "newest" | "oldest" | "priority";
}