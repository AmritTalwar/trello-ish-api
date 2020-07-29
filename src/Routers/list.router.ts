import { Router } from "express";
import * as ListController from "../Controllers/list.controller";
import * as ListMiddlewares from "../middlewares/list.middlewares";

const ListRouter: Router = Router();

ListRouter.post(
  "",
  ListMiddlewares.verifyUserCanCreateList,
  ListController.createList
);

export { ListRouter };
