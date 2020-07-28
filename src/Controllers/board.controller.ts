import { Request, Response } from "express";
import { Team } from "../Entities/team.entity";
import { getConnection } from "typeorm";
import { Board } from "../Entities/board.entity";
import { response } from "../utils/response.util";

export const createBoard = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const board: Board = new Board();

  board.name = req.body.name;

  if (!req.body.teamId) {
    board.user = req.user;
  } else {
    verifyUserCanChangeTeam(req, res, req.body.teamId);
    board.team = req.team;
  }

  await board.save();

  return response(res, 201, { payload: board });
};

export const verifyUserCanChangeTeam = async (
  req: Request,
  res: Response,
  teamId: string
): Promise<Response | void> => {
  const team:
    | Team
    | undefined = await getConnection()
    .createQueryBuilder()
    .select("team")
    .from(Team, "team")
    .where("team.uuid = :uuid", { uuid: teamId })
    .leftJoinAndSelect("team.users", "users")
    .getOne();
  if (!team) {
    return response(res, 404, {
      message: `team with id ${teamId} not found`,
    });
  }

  const userIsInDesiredBoardTeam: Boolean = Boolean(
    team.users.find((user) => {
      return user.uuid === req.user.uuid;
    })
  );
  if (!userIsInDesiredBoardTeam) {
    return response(res, 403, {
      message: "cannot create board in team you are not a part of",
    });
  }

  req.team = team;
};
