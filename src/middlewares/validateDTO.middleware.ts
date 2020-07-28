import { Response, Request, NextFunction } from "express";
import * as Joi from "@hapi/joi";
import { response } from "../utils/response.util";

export const validateDTO = (DTO: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    const noReqBody: Boolean = !Boolean(req.body);
    const { error } = DTO.validate(req.body, {
      abortEarly: false,
    });

    console.log(error);
    if (error || noReqBody) {
      return response(res, 400, {
        message: "malformed request body",
      });
    }

    next();
  };
};
