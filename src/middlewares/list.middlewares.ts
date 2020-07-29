import { Request, Response, NextFunction } from "express";
import { Board } from "../Entities/board.entity";
import { getConnection } from "typeorm";
import { response } from "../utils/response.util";

export const verifyUserCanCreateList = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { boardId } = req.body;

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
    .leftJoinAndSelect("team.users", "users")
    .getOne();

  if (!board) {
    return response(res, 404, {
      message: `board with id ${boardId} does not exist`,
    });
  }

  if (board.user && board.user.uuid !== req.user.uuid) {
    return response(res, 403, { message: "you do not own the parent board" });
  }
  if (board.team) {
    const userInBoardTeam: Boolean = Boolean(
      board.team.users.find((user) => {
        return user.uuid === req.user.uuid;
      })
    );

    if (!userInBoardTeam) {
      return response(res, 403, {
        message: "you are not part of resource parent team",
      });
    }
  }

  req.board = board;

  next();
};
