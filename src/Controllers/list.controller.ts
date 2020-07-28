import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { Board } from "../Entities/board.entity";
import { List } from "../Entities/list.entity";
import { response } from "../utils/response.util";

export const createList = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, boardId } = req.body;
  const list: List = new List();

  list.name = name;

  const board:
    | Board
    | undefined = await getConnection()
    .createQueryBuilder()
    .select("board")
    .from(Board, "board")
    .where("board.uuid = :uuid", { uuid: boardId })
    .leftJoinAndSelect("board.lists", "lists")
    .leftJoinAndSelect("board.user", "user")
    .leftJoinAndSelect("board.team", "team")
    .getOne();

  if (!board) {
    return response(res, 404, {
      message: `board with id ${boardId} not found`,
    });
  }

  list.board = board;

  list.order = board.lists.length + 1;

  await list.save();

  return response(res, 201, { payload: list });
};

export const checkUserCanModify;
