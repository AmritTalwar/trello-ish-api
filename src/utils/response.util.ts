import { Response } from "express";
import { responseInterface } from "../interfaces/response.interface";

export const response = (
  res: Response,
  statusCode: number,
  json: responseInterface = { payload: {} }
): Response => {
  let success;
  statusCode >= 400 ? (success = false) : (success = true);

  return res.status(statusCode).send({ ...json, success, statusCode });
};
