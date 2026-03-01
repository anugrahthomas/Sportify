import { Request, Response } from "express";
import { matchIdParamSchema } from "../validations/matches";
import {
  createCommentarySchema,
  listCommentaryQuerySchema,
} from "../validations/commentary";
import { db } from "../db/db";
import { commentary } from "../db/schema";
import { desc, eq } from "drizzle-orm";

const MAX_LIMIT = 100;

export const createCommentary = async (req: Request, res: Response) => {
  const params = matchIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res
      .status(400)
      .json({ message: "Invalid ID", error: JSON.stringify(params.error) });
  }
  const parsedData = createCommentarySchema.safeParse(req.body);
  if (!parsedData.success) {
    return res
      .status(400)
      .json({ message: "Invalid Inputs", error: JSON.stringify(params.error) });
  }

  try {
    const [result] = await db
      .insert(commentary)
      .values({
        matchId: params.data.id,
        ...parsedData.data,
      })
      .returning();

    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};

export const getCommentary = async (req: Request, res: Response) => {
  const params = matchIdParamSchema.safeParse(req.params);
  if (!params.success) {
    return res.json(400).json({ error: JSON.stringify(params.error) });
  }

  const query = listCommentaryQuerySchema.safeParse(req.query);
  if (!query.success) {
    return res.status(400).json({ error: JSON.stringify(query.error) });
  }

  try {
    const { id } = params.data;
    const { limit = 10 } = query.data;
    const safeLimit = Math.min(limit, MAX_LIMIT);

    const result = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, id))
      .orderBy(desc(commentary.createdAt))
      .limit(safeLimit);

    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};
