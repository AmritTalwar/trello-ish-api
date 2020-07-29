import { Response, Request } from "express";
import { Task } from "../Entities/task.entity";

import { response } from "../utils/response.util";

export const createTask = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, description } = req.body;

  const task: Task = Task.create();
  task.title = title;
  task.description = description;

  task.list = req.list;
  task.order = req.list.tasks.length + 1;

  await task.save();

  return response(res, 201, { payload: task });
};
