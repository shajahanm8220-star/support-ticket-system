import { Request, Response, NextFunction } from "express";

import {
  createCustomer,
  createTicket,
  findTickets,
  findTicketById,
  updateTicketStatus,
  updateTicketAgent,
  updateTicket,
  deleteTicket,
} from "../repositories/ticketRepository";

// =====================================================
// GET ALL TICKETS
// =====================================================

export async function getTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page ?? "1"), 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(String(req.query.limit ?? "10"), 10) || 10
      )
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    const priority =
      typeof req.query.priority === "string"
        ? req.query.priority
        : undefined;

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : undefined;

    const agentId =
      typeof req.query.agentId === "string" &&
      req.query.agentId.trim() !== ""
        ? Number(req.query.agentId)
        : undefined;

    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : undefined;

    if (
      agentId !== undefined &&
      (!Number.isInteger(agentId) || agentId <= 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid agent ID",
      });
      return;
    }

    const offset = (page - 1) * limit;

    const result = await findTickets(
      search,
      status,
      priority,
      category,
      agentId,
      sort,
      limit,
      offset
    );

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// GET TICKET BY ID
// =====================================================

export async function getTicketById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    const ticket = await findTicketById(id);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// CREATE NEW TICKET
// =====================================================

export async function createNewTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const {
      customerName,
      customerEmail,
      subject,
      description,
      priority,
      category,
    } = req.body as {
      customerName?: unknown;
      customerEmail?: unknown;
      subject?: unknown;
      description?: unknown;
      priority?: unknown;
      category?: unknown;
    };

    if (
      typeof customerName !== "string" ||
      typeof customerEmail !== "string" ||
      typeof subject !== "string" ||
      typeof description !== "string" ||
      typeof priority !== "string" ||
      typeof category !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "All ticket fields must be provided as strings",
      });
      return;
    }

    const normalizedName = customerName.trim();
    const normalizedEmail = customerEmail.trim();
    const normalizedSubject = subject.trim();
    const normalizedDescription = description.trim();
    const normalizedPriority = priority.trim().toUpperCase();
    const normalizedCategory = category.trim().toUpperCase();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedSubject ||
      !normalizedDescription ||
      !normalizedPriority ||
      !normalizedCategory
    ) {
      res.status(400).json({
        success: false,
        message: "All ticket fields are required",
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid customer email",
      });
      return;
    }

    if (normalizedDescription.length < 10) {
      res.status(400).json({
        success: false,
        message: "Description must contain at least 10 characters",
      });
      return;
    }

    const allowedPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "CRITICAL",
    ];

    const allowedCategories = [
      "TECHNICAL",
      "BILLING",
      "ACCOUNT",
      "GENERAL",
    ];

    if (!allowedPriorities.includes(normalizedPriority)) {
      res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
      return;
    }

    if (!allowedCategories.includes(normalizedCategory)) {
      res.status(400).json({
        success: false,
        message: "Invalid category",
      });
      return;
    }

    const customerId = await createCustomer(
      normalizedName,
      normalizedEmail
    );

    const ticketId = await createTicket(
      customerId,
      normalizedSubject,
      normalizedDescription,
      normalizedPriority,
      normalizedCategory
    );

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: {
        id: ticketId,
        customer_id: customerId,
      },
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// UPDATE TICKET DETAILS
// =====================================================

export async function updateTicketController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    const {
      subject,
      description,
      priority,
      category,
    } = req.body as {
      subject?: unknown;
      description?: unknown;
      priority?: unknown;
      category?: unknown;
    };

    if (
      typeof subject !== "string" ||
      typeof description !== "string" ||
      typeof priority !== "string" ||
      typeof category !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Subject, description, priority, and category are required",
      });
      return;
    }

    const normalizedSubject = subject.trim();
    const normalizedDescription = description.trim();
    const normalizedPriority = priority.trim().toUpperCase();
    const normalizedCategory = category.trim().toUpperCase();

    if (
      !normalizedSubject ||
      !normalizedDescription ||
      !normalizedPriority ||
      !normalizedCategory
    ) {
      res.status(400).json({
        success: false,
        message: "Ticket fields cannot be empty",
      });
      return;
    }

    if (normalizedDescription.length < 10) {
      res.status(400).json({
        success: false,
        message: "Description must contain at least 10 characters",
      });
      return;
    }

    const allowedPriorities = [
      "LOW",
      "MEDIUM",
      "HIGH",
      "CRITICAL",
    ];

    const allowedCategories = [
      "TECHNICAL",
      "BILLING",
      "ACCOUNT",
      "GENERAL",
    ];

    if (!allowedPriorities.includes(normalizedPriority)) {
      res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
      return;
    }

    if (!allowedCategories.includes(normalizedCategory)) {
      res.status(400).json({
        success: false,
        message: "Invalid category",
      });
      return;
    }

    const existingTicket = await findTicketById(id);

    if (!existingTicket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    const updated = await updateTicket(
      id,
      normalizedSubject,
      normalizedDescription,
      normalizedPriority,
      normalizedCategory
    );

    if (!updated) {
      res.status(500).json({
        success: false,
        message: "Unable to update ticket",
      });
      return;
    }

    const ticket = await findTicketById(id);

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// DELETE TICKET
// =====================================================

export async function deleteTicketController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    const existingTicket = await findTicketById(id);

    if (!existingTicket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    const deleted = await deleteTicket(id);

    if (!deleted) {
      res.status(500).json({
        success: false,
        message: "Unable to delete ticket",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// CHANGE TICKET STATUS
// =====================================================

export async function changeTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);
    const { status } = req.body as {
      status?: unknown;
    };

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    if (typeof status !== "string") {
      res.status(400).json({
        success: false,
        message: "Status is required",
      });
      return;
    }

    const normalizedStatus = status.trim().toUpperCase();

    const allowedStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    if (!allowedStatuses.includes(normalizedStatus)) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket status",
      });
      return;
    }

    const ticket = await findTicketById(id);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    const allowedTransitions: Record<string, string[]> = {
      OPEN: ["IN_PROGRESS", "CLOSED"],
      IN_PROGRESS: ["RESOLVED", "CLOSED"],
      RESOLVED: [],
      CLOSED: [],
    };

    if (
      !allowedTransitions[ticket.status]?.includes(
        normalizedStatus
      )
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot change status from ${ticket.status} to ${normalizedStatus}`,
      });
      return;
    }

    await updateTicketStatus(id, normalizedStatus);

    const updatedTicket = await findTicketById(id);

    res.status(200).json({
      success: true,
      message: "Ticket status updated successfully",
      data: updatedTicket,
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// ASSIGN TICKET TO AGENT
// =====================================================

export async function assignTicketAgent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketId = Number(req.params.id);

    const { agentId } = req.body as {
      agentId?: unknown;
    };

    if (!Number.isInteger(ticketId) || ticketId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    if (
      typeof agentId !== "number" ||
      !Number.isInteger(agentId) ||
      agentId <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "A valid numeric agentId is required",
      });
      return;
    }

    const ticket = await findTicketById(ticketId);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    const updated = await updateTicketAgent(ticketId, agentId);

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "Unable to assign agent. Check that the agent exists.",
      });
      return;
    }

    const updatedTicket = await findTicketById(ticketId);

    res.status(200).json({
      success: true,
      message: "Agent assigned successfully",
      data: updatedTicket,
    });
  } catch (error: unknown) {
    next(error);
  }
}

// Export names used by ticketRoutes.ts
export {
  updateTicketController as updateTicket,
  deleteTicketController as deleteTicket,
};