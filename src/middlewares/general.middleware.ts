import { Request, Response, NextFunction } from "express";
import { Team } from "../Entities/team.entity";
import { response } from "../utils/response.util";
import { Board } from "../Entities/board.entity";
import { List } from "../Entities/list.entity";
import { getConnection } from "typeorm";
import { Task } from "../Entities/task.entity";
import { User } from "../Entities/user.entity";

/**
 * Get protected resources being queried and check if the user is a parent owner of the resource
 */
export const verifyUserIsProtectedResourceParentOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Check to see if the resources being queried in the url and the req body belong to the user
   */
  await checkUserOwnesResources(req, res, req.body);
  await checkUserOwnesResources(req, res, req.params);
  next();
};

export const checkUserOwnesResources = async (
  req: Request,
  res: Response,
  object: any
): Promise<void | Response> => {
  /**
   * Go through each key of object (body or url params) and get any resource ID's being queried. Get the resource with it's parent owners
   * and check if the current user is one of the owners, if not then throw a 403
   */
  for (const key of Object.keys(object)) {
    let resourceOwners: User[];

    if (key === "teamId") {
      const team: Team | undefined = await Team.findOne({
        where: { uuid: object[key] },
        relations: ["members"],
      });

      if (!team) {
        return response(res, 404, {
          message: `team with id ${object[key]} not found`,
        });
      }
      resourceOwners = team.members;
      req.team = team;
    } else if (key === "boardId") {
      const board: Board | undefined = await Board.findOne({
        where: { uuid: object[key] },
        relations: ["ownerTeam", "ownerTeam.members", "ownerUser"],
      });

      if (!board) {
        return response(res, 404, {
          message: `board with id ${object[key]} not found`,
        });
      }

      if (board.ownerUser) {
        resourceOwners = [board.ownerUser];
      } else {
        resourceOwners = board.ownerTeam.members;
      }
      req.board = board;
    } else if (key === "listId") {
      const list:
        | List
        | undefined = await getConnection()
        .createQueryBuilder()
        .select("list")
        .from(List, "list")
        .where("list.uuid = :uuid", { uuid: object[key] })
        .leftJoinAndSelect("list.board", "board")
        .leftJoinAndSelect("board.ownerUser", "ownerUser")
        .leftJoinAndSelect("board.ownerTeam", "ownerTeam")
        .leftJoinAndSelect("ownerTeam.members", "members")
        .getOne();

      if (!list) {
        return response(res, 404, {
          message: `list with id ${object[key]} not found`,
        });
      }
      if (list.board.ownerUser) {
        resourceOwners = [list.board.ownerUser];
      } else {
        resourceOwners = list.board.ownerTeam.members;
      }
      req.list = list;
    } else if (key === "taskId") {
      const task: Task | undefined = await Task.findOne({
        where: { uuid: object[key] },
        relations: ["list.board.ownerUser", "list.board.ownerTeam.members"],
      });

      if (!task) {
        return response(res, 404, {
          message: `task with id ${object[key]} not found`,
        });
      }
      if (task.list.board.ownerUser) {
        resourceOwners = [task.list.board.ownerUser];
      } else {
        resourceOwners = task.list.board.ownerTeam.members;
      }
      req.task = task;
    } else {
      return;
    }

    const userIsInResourceOwners: Boolean = Boolean(
      resourceOwners.find((owner) => {
        return owner.uuid === req.user.uuid;
      })
    );

    if (!userIsInResourceOwners) {
      return res.sendStatus(403);
    }
  }
};
