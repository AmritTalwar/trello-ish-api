import { Request, Response } from "express";
import { response } from "../utils/response.util";
import { Team } from "../Entities/team.entity";

export const createTeam = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { name } = req.body;

  const team: Team = new Team();
  team.name = name;
  team.members = [req.user];

  await team.save();

  return response(res, 201, { payload: team });
};
