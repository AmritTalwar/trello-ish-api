import { createConnection } from "typeorm";
import ormconfig from "../ormconfig";
import { app } from "./app";
import { User } from "./Entities/user.entity";
import { Board } from "./Entities/board.entity";
import { Task } from "./Entities/task.entity";
import { List } from "./Entities/list.entity";
import { Team } from "./Entities/team.entity";
(async () => {
  await createConnection({
    ...ormconfig,
    entities: [User, Board, List, Task, Team],
  });
})();

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Express app listening on port ${process.env.SERVER_PORT}`)
);
