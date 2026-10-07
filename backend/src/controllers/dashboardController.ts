import { Request, Response, NextFunction } from "express";
import { getDashboardStats } from "../repositories/dashboardRepository";

export async function getDashboard(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dashboard = await getDashboardStats();

    res.status(200).json(dashboard);
  } catch (error: unknown) {
    next(error);
  }
}