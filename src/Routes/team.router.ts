import { Router } from "express";
import * as TeamController from "../Controllers/team.controller";

const TeamRouter: Router = Router();

TeamRouter.post("", TeamController.createTeam);

export { TeamRouter };
