import { Request, Response, NextFunction } from "express";

import {
  createCustomer,
  createTicket,
  findTickets,
  findTicketById,
  updateTicketStatus,
  updateTicketAgent,
} from "../repositories/ticketRepository";

// =====================================================
// GET ALL TICKETS
// GET /api/tickets
// =====================================================

export async function getTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const search =
      typeof req.query.search === "string"
        ? req.query.search
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
      req.query.agentId !== undefined
        ? Number(req.query.agentId)
        : undefined;

    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : undefined;

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
      data: result.rows,
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(
        result.total / limit
      ),
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// GET SINGLE TICKET
// GET /api/tickets/:id
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
// CREATE TICKET
// POST /api/tickets
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
      customerName?: string;
      customerEmail?: string;
      subject?: string;
      description?: string;
      priority?: string;
      category?: string;
    };

    // Required fields
    if (
      !customerName ||
      !customerEmail ||
      !subject ||
      !priority ||
      !category
    ) {
      res.status(400).json({
        success: false,
        message:
          "Name, email, subject, priority and category are required",
      });
      return;
    }

    // Email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customerEmail.trim())) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }

    // Description validation
    if (
      !description ||
      description.trim().length < 10
    ) {
      res.status(400).json({
        success: false,
        message:
          "Description must contain at least 10 characters",
      });
      return;
    }

    // Create customer
    const customerId = await createCustomer(
      customerName.trim(),
      customerEmail.trim()
    );

    // Create ticket
    const ticketId = await createTicket(
      customerId,
      subject.trim(),
      description.trim(),
      priority,
      category
    );

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticketId,
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// CHANGE TICKET STATUS
// PATCH /api/tickets/:id/status
// =====================================================

export async function changeTicketStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    // Validate ticket ID
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    const { status } = req.body as {
      status?: string;
    };

    const allowedStatuses = [
      "OPEN",
      "IN_PROGRESS",
      "RESOLVED",
      "CLOSED",
    ];

    // Validate status
    if (
      !status ||
      !allowedStatuses.includes(status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid status",
      });
      return;
    }

    // Find current ticket
    const ticket = await findTicketById(id);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    const currentStatus = ticket.status;

    // Status workflow
    const allowedTransitions: Record<
      string,
      string[]
    > = {
      OPEN: [
        "IN_PROGRESS",
        "CLOSED",
      ],
      IN_PROGRESS: [
        "RESOLVED",
        "CLOSED",
      ],
      RESOLVED: [],
      CLOSED: [],
    };

    const nextStatuses =
      allowedTransitions[currentStatus] || [];

    // Check whether transition is allowed
    if (!nextStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message:
          `Cannot change status from ${currentStatus} to ${status}`,
      });
      return;
    }

    // Update status in MySQL
    const updated =
      await updateTicketStatus(
        id,
        status
      );

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "Status was not updated",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message:
        "Ticket status updated successfully",
      status,
    });
  } catch (error: unknown) {
    next(error);
  }
}

// =====================================================
// ASSIGN AGENT
// PATCH /api/tickets/:id/agent
// =====================================================

export async function assignTicketAgent(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ticketId = Number(req.params.id);
    const { agentId } = req.body as {
      agentId?: number;
    };

    // Validate ticket ID
    if (
      !Number.isInteger(ticketId) ||
      ticketId <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid ticket ID",
      });
      return;
    }

    // Validate agent ID
    if (
      agentId === undefined ||
      !Number.isInteger(Number(agentId)) ||
      Number(agentId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Valid agent ID is required",
      });
      return;
    }

    // Check ticket exists
    const ticket = await findTicketById(ticketId);

    if (!ticket) {
      res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
      return;
    }

    // Update agent
    const updated = await updateTicketAgent(
      ticketId,
      Number(agentId)
    );

    if (!updated) {
      res.status(400).json({
        success: false,
        message: "Agent was not assigned",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Agent assigned successfully",
      agentId: Number(agentId),
    });
  } catch (error: unknown) {
    next(error);
  }
}