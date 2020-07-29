import { Router } from "express";
import * as BoardController from "../Controllers/board.controller";
import * as BoardMiddlewards from "../middlewares/board.middlewares";

const BoardRouter: Router = Router();

BoardRouter.post(
  "",
  BoardMiddlewards.verifyUserCanCreateBoard,
  BoardController.createBoard
);

export { BoardRouter };
