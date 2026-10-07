import {
  Request,
  Response,
  NextFunction,
} from "express";

import { findAgents } from "../repositories/agentRepository";

export async function getAgents(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const agents = await findAgents();

    res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error: unknown) {
    next(error);
  }
}