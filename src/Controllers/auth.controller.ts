import { Response, Request } from "express";
import { User } from "../Entities/user.entity";
import { response } from "../utils/response.util";
import { getConnection } from "typeorm";
import * as bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  const user:
    | User
    | undefined = await getConnection()
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.email = :email", { email: email })
    .addSelect("user.password")
    .addSelect("user.salt")
    .getOne();

  if (!user) {
    return response(res, 401, { message: "Invalid credentials" });
  }

  const passwordCorrect: Boolean = Boolean(
    (await bcrypt.hash(password, user.salt)) === user.password
  );
  if (!passwordCorrect) {
    return response(res, 401, { message: "Invalid credentials" });
  }

  req.session!.alive = true;
  delete user.password;
  delete user.salt;
  req.session!.user = user;

  return response(res, 200);
};

export const logout = (req: Request, res: Response) => {
  if (!req.session!) {
    return response(res, 200);
  }

  req.session!.destroy((err: any) => {
    if (err) {
      throw err;
    }
  });

  return response(res, 200);
};
