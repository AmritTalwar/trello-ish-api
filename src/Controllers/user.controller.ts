import { Request, Response } from "express";
import { User } from "../Entities/user.entity";
import { response } from "../utils/response.util";
import * as bcrypt from "bcryptjs";

export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name, email, password } = req.body;
  const user: User = new User();
  user.name = name;
  user.email = email;
  user.password = password;

  user.salt = await bcrypt.genSalt();

  await user.save();

  delete user.password;
  delete user.salt;

  return response(res, 201, { payload: user });
};
