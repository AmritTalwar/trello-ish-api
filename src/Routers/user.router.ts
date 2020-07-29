import { Router } from "express";
import { createUserDTO } from "../DTO/user.dto";
import { validateDTO } from "../middlewares/validateDTO.middleware";
import * as UserController from "../Controllers/user.controller";

const UserRouter: Router = Router();

UserRouter.post("", validateDTO(createUserDTO), UserController.createUser);

export { UserRouter };
