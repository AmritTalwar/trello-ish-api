import { Request, Response } from "express";
import { Board } from "../Entities/board.entity";
import { response } from "../utils/response.util";

export const createBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const board: Board = new Board();

  board.name = req.body.name;

  if (!req.body.teamId) {
    board.user = req.user;
  } else {
    board.team = req.team;
  }

  await board.save();

  return response(res, 201, { payload: board });
};
