import { Router } from "express";
import * as ListController from "../Controllers/list.controller";

const ListRouter: Router = Router();

ListRouter.post("", ListController.createList);

export { ListRouter };
