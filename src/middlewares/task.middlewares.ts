import { Request, Response, NextFunction } from "express";
import { List } from "../Entities/list.entity";
import { getConnection } from "typeorm";
import { response } from "../utils/response.util";

export const verifyUserCanCreateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { listId } = req.body;

  const list:
    | List
    | undefined = await getConnection()
    .createQueryBuilder()
    .select("list")
    .from(List, "list")
    .where("list.uuid = :uuid", { uuid: listId })
    .leftJoinAndSelect("list.board", "board")
    .leftJoinAndSelect("board.user", "user")
    .leftJoinAndSelect("board.team", "team")
    .leftJoinAndSelect("team.users", "users")
    .getOne();

  if (!list) {
    return response(res, 404, {
      message: `list with id ${listId} does not exist`,
    });
  }

  if (list.board.user && list.board.user.uuid !== req.user.uuid) {
    return response(res, 403, { message: "you do not own the parent board" });
  }
  if (list.board.team) {
    const userInBoardTeam: Boolean = Boolean(
      list.board.team.users.find((user) => {
        return user.uuid === req.user.uuid;
      })
    );

    if (!userInBoardTeam) {
      return response(res, 403, {
        message: "you are not part of resource parent team",
      });
    }
  }

  req.list = list;

  next();
};
