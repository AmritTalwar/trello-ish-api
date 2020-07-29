import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Board } from "../Entities/board.entity";
import { List } from "../Entities/list.entity";
import { response } from "../utils/response.util";

export const createList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name } = req.body;
  const list: List = List.create();

  list.name = name;
  list.board = req.board;
  list.order = req.board.lists.length + 1;

  await list.save();

  return response(res, 201, { payload: list });
};
