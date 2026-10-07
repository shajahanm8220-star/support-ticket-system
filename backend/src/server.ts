import express, {
  Request,
  Response,
  NextFunction,
} from "express";

import cors from "cors";
import dotenv from "dotenv";
import ticketRoutes from "./routes/ticketRoutes";
import agentRoutes from "./routes/agentRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Support Ticket API is running",
  });
});

console.log("Ticket routes loaded");

app.use("/api/tickets", ticketRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(
  (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(
    `Backend running on http://localhost:${PORT}`
  );
});