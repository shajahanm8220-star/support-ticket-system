import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController";

const router = Router();

router.get("/", getDashboard);

export default router;