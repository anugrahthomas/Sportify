import { Router } from "express";
import { createMatch, getMatches } from "../controllers/match.controller";

const matchRouter = Router();

matchRouter.get("/matches", getMatches);
matchRouter.post("/matches", createMatch);

export default matchRouter;
