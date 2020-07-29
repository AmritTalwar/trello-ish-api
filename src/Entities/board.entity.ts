import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Unique,
  ManyToOne,
} from "typeorm";

import { Team } from "./team.entity";
import { List } from "./list.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["name", "team"])
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.boards, { nullable: true })
  user: User;

  @ManyToOne(() => Team, (team) => team.boards, { nullable: true })
  team: Team;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];
}
