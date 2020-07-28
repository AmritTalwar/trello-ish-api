import { Response, Request } from "express";
import { List } from "../Entities/list.entity";
import { Task } from "../Entities/task.entity";
import { User } from "../Entities/user.entity";
import { getConnection } from "typeorm";

import { response } from "../utils/response.util";

export const createTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description, listId } = req.body;

  const task: Task = new Task();
  task.title = title;
  task.description = description;

  const list:
    | List
    | undefined = await getConnection()
    .createQueryBuilder()
    .select("list")
    .from(List, "list")
    .where("list.uuid = :uuid", { uuid: listId })
    .leftJoinAndSelect("list.board", "board")
    .leftJoinAndSelect("list.tasks", "tasks")
    .leftJoinAndSelect("board.team", "team")
    .leftJoinAndSelect("team.users", "users")
    .leftJoinAndSelect("board.user", "user")
    .getOne();

  if (!list) {
    return response(res, 404, { message: `could not find list` });
  }

  console.log(req.user);
  const listBoardOwnedByTeam: Boolean = Boolean(list.board.team);

  if (listBoardOwnedByTeam) {
    const userIsInListParentTeam: Boolean = Boolean(
      list.board.team.users.find((user) => user.uuid === req.user.uuid)
    );
    if (!userIsInListParentTeam) {
      return response(res, 403, {
        message: "you a not a part of the parent team",
      });
    }
  } else {
    // List parent board owned by a user
    const userIsListParentBoardOwner: Boolean = Boolean(
      list.board.user.uuid === req.user.uuid
    );
    if (!userIsListParentBoardOwner) {
      return response(res, 403, {
        message: "you are not the owner of this board",
      });
    }
  }

  task.list = list;
  task.order = list.tasks.length + 1;

  await task.save();

  return response(res, 201, { payload: task });
};
