import { Router } from "express";

import {
  getTickets,
  createNewTicket,
  getTicketById,
  changeTicketStatus,
  assignTicketAgent,
} from "../controllers/ticketController";

const router = Router();

router.get("/", getTickets);

router.post("/", createNewTicket);

router.patch("/:id/status", changeTicketStatus);

router.patch("/:id/agent", assignTicketAgent);

router.get("/:id", getTicketById);

export default router;