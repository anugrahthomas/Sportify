import { Router } from "express";
import { createMatch, getMatches } from "../controllers/match.controller";

const matchRouter = Router();

matchRouter.get("/", getMatches);
matchRouter.post("/", createMatch);

export default matchRouter;
