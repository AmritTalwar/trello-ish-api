import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  Unique,
  ManyToMany,
  JoinTable,
} from "typeorm";

import * as bcrypt from "bcryptjs";
import { Task } from "./task.entity";
import { Team } from "./team.entity";
import { Board } from "./board.entity";

@Entity()
@Unique(["email"])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  @OneToMany(() => Task, (task) => task.assignee, { nullable: true })
  assignedTasks: Task[];

  @ManyToMany(() => Team, (team) => team.members, { nullable: true })
  teams: Team[];

  @OneToMany(() => Board, (board) => board.ownerUser, { nullable: true })
  personalBoards: Board[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
