import {
  Ticket,
  TicketListResponse,
  CreateTicketInput,
  TicketStatus,
  Priority,
  Category,
} from "../types/ticket";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

// =====================================================
// GET ALL TICKETS
// GET /api/tickets
// =====================================================

export async function getTickets(
  page = 1,
  limit = 10,
  search = "",
  status = "",
  priority = "",
  category = "",
  agentId = "",
  sort = "newest"
): Promise<TicketListResponse> {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  if (priority) {
    params.set("priority", priority);
  }

  if (category) {
    params.set("category", category);
  }

  if (agentId) {
    params.set("agentId", agentId);
  }

  if (sort) {
    params.set("sort", sort);
  }

  const response = await fetch(
    `${API_URL}/tickets?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch tickets"
    );
  }

  return result;
}

// =====================================================
// GET SINGLE TICKET
// GET /api/tickets/:id
// =====================================================

export async function getTicket(
  id: number
): Promise<Ticket> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ticket ID");
  }

  const response = await fetch(
    `${API_URL}/tickets/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch ticket"
    );
  }

  return result.data;
}

// =====================================================
// CREATE TICKET
// POST /api/tickets
// =====================================================

export async function createTicket(
  data: CreateTicketInput
) {
  const response = await fetch(
    `${API_URL}/tickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to create ticket"
    );
  }

  return result as {
    success: boolean;
    message: string;
    ticketId: number;
  };
}

// =====================================================
// UPDATE TICKET STATUS
// PATCH /api/tickets/:id/status
// =====================================================

export async function updateTicketStatus(
  id: number,
  status: TicketStatus
) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Invalid ticket ID");
  }

  const response = await fetch(
    `${API_URL}/tickets/${id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to update ticket status"
    );
  }

  return result as {
    success: boolean;
    message: string;
    status: TicketStatus;
  };
}

// =====================================================
// GET AGENTS
// GET /api/agents
// =====================================================

export async function getAgents() {
  const response = await fetch(
    `${API_URL}/agents`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch agents"
    );
  }

  return result;
}