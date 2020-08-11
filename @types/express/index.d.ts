import { Board } from "../../src/Entities/board.entity";
import { User } from "../../src/Entities/user.entity";
import { Team } from "../../src/Entities/team.entity";
import { List } from "../../src/Entities/list.entity";
import { Task } from "src/Entities/task.entity";

export {};

declare global {
  namespace Express {
    interface Request {
      user: User;
      board: Board;
      team: Team;
      list: List;
      task: Task;
    }
  }
}
