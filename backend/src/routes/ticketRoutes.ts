import { Router } from "express";

import {
  getTickets,
  createNewTicket,
  getTicketById,
  changeTicketStatus,
} from "../controllers/ticketController";

const router = Router();

router.get("/", getTickets);

router.post("/", createNewTicket);

router.get("/:id", getTicketById);

router.patch("/:id/status", changeTicketStatus);

export default router;