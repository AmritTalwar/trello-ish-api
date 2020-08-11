import { Response, Request } from "express";
import { Task } from "../Entities/task.entity";

import { response } from "../utils/response.util";
import { List } from "../Entities/list.entity";

export const createTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description } = req.body;

  const task: Task = Task.create();
  const list: List = req.list;

  task.title = title;
  task.description = description;

  task.list = list;
  task.order = (await list.getTasks()).length + 1;

  await task.save();

  return response(res, 201, { payload: task });
};
