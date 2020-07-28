import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Unique,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { User } from "./user.entity";
import { Board } from "./board.entity";

@Entity()
@Unique(["name"])
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinTable()
  users: User[];

  @OneToMany(() => Board, (board) => board.team)
  boards: Board[];
}
