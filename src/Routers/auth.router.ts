import { Router } from "express";
import * as AuthController from "../Controllers/auth.controller";

const AuthRouter: Router = Router();

AuthRouter.post("/login", AuthController.login);

export { AuthRouter };
