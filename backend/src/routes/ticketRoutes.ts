import { Router } from "express";

import {
  getTickets,
  createNewTicket,
  getTicketById,
  changeTicketStatus,
  assignTicketAgent,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketController";

const router = Router();

// GET /api/tickets
// Get all tickets with search, filtering, sorting, and pagination
router.get("/", getTickets);

// POST /api/tickets
// Create a new ticket
router.post("/", createNewTicket);

// GET /api/tickets/:id
// Get a single ticket by ID
router.get("/:id", getTicketById);

// PUT /api/tickets/:id
// Update an existing ticket
router.put("/:id", updateTicket);

// DELETE /api/tickets/:id
// Delete a ticket
router.delete("/:id", deleteTicket);

// PATCH /api/tickets/:id/assign
// Assign a ticket to an agent
router.patch("/:id/assign", assignTicketAgent);

// PATCH /api/tickets/:id/status
// Update ticket status
router.patch("/:id/status", changeTicketStatus);

export default router;