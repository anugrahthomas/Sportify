import type { Request, Response } from "express";
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from "../validations/matches";
import { db } from "../db/db";
import { matches } from "../db/schema";
import { getMatchStatus } from "../utils/matchStatus";
import { desc } from "drizzle-orm";
const MAX_LIMIT = 100;

export const createMatch = async (req: Request, res: Response) => {
  const parsedData = createMatchSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      error: "Invalid Inputs",
      message: JSON.stringify(parsedData.error),
    });
  }

  try {
    const { startTime, endTime, homeScore, awayScore } = parsedData.data;
    const [event] = await db
      .insert(matches)
      .values({
        ...parsedData.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        homeScore: homeScore ?? 0,
        awayScore: awayScore ?? 0,
        status: getMatchStatus(startTime, endTime),
      })
      .returning();
    res.status(201).json({ data: event });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create match",
      message: JSON.stringify(error),
    });
  }
};

export const getMatches = async (req: Request, res: Response) => {
  const parsedData = listMatchesQuerySchema.safeParse(req.query);
  if (!parsedData.success) {
    return res.status(400).json({
      error: "Invalid Inputs",
      message: JSON.stringify(parsedData.error),
    });
  }
  const limit = Math.min(parsedData.data.limit ?? 50, MAX_LIMIT);
  try {
    const data = await db
      .select()
      .from(matches)
      .orderBy(desc(matches.createdAt))
      .limit(limit);

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Falied to fetch matches", message: error });
  }
};
