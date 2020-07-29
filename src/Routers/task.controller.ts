import { Router } from "express";
import * as TaskController from "../Controllers/task.controller";

const TaskRouter: Router = Router();

TaskRouter.post("", TaskController.createTask);

export { TaskRouter };
