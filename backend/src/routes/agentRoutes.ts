import { Router } from "express";
import { getAgents } from "../controllers/agentController";

const router = Router();

// GET /api/agents
router.get("/", getAgents);

export default router;