import { Router } from "express";
import { createCommentary, getCommentary } from "../controllers/commentary.controller";

const commentaryRouter = Router({ mergeParams: true });

commentaryRouter.get("/", getCommentary);
commentaryRouter.post("/", createCommentary);

export default commentaryRouter;
