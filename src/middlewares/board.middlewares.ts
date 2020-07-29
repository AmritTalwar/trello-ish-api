import { Request, Response, NextFunction } from "express";
import { Team } from "../Entities/team.entity";
import { response } from "../utils/response.util";
import { getConnection } from "typeorm";

export const verifyUserCanCreateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const boardToBeOwnedByTeam: Boolean = Boolean(req.body.teamId);

  if (!boardToBeOwnedByTeam) {
    return next();
  }

  const team:
    | Team
    | undefined = await getConnection()
    .createQueryBuilder()
    .select("team")
    .from(Team, "team")
    .where("team.uuid = :uuid", { uuid: req.body.teamId })
    .leftJoinAndSelect("team.users", "users")
    .getOne();

  if (!team) {
    return response(res, 404, {
      message: `team with id ${req.body.teamId} does not exist`,
    });
  }

  const userIsInDesiredBoardTeam: Boolean = Boolean(
    team.users.find((user) => {
      return user.uuid === req.user.uuid;
    })
  );

  if (!userIsInDesiredBoardTeam) {
    return response(res, 403, {
      message: "you are not part of the desired parent team",
    });
  }

  req.team = team;

  next();
};
