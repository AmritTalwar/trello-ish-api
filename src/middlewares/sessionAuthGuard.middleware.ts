import { Response, Request, NextFunction } from "express";
import { response } from "../utils/response.util";

export const sessionAuthGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.url === "/user" && req.method === "POST") {
    return next();
  }

  if (!req.session!.alive) {
    return response(res, 401, {
      message: "Login session expired, please login",
    });
  }

  req.user = req.session!.user;

  next();
};
