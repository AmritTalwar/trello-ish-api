import { Router } from "express";
import * as TaskController from "../Controllers/task.controller";
import * as TaskMiddlewares from "../middlewares/task.middlewares";

const TaskRouter: Router = Router();

TaskRouter.post(
  "",
  TaskMiddlewares.verifyUserCanCreateTask,
  TaskController.createTask
);

export { TaskRouter };
