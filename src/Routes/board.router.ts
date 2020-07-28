import { Router } from "express";
import * as BoardController from "../Controllers/board.controller";

const BoardRouter: Router = Router();

BoardRouter.post("", BoardController.createBoard);

export { BoardRouter };
