import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  BeforeInsert,
  Unique,
  ManyToMany,
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

  @OneToMany(() => Task, (task) => task.owner, { nullable: true })
  tasks: Task[];

  @ManyToMany(() => Team, (team) => team.users, { nullable: true })
  teams: Team[];

  @OneToMany(() => Board, (board) => board.user, { nullable: true })
  boards: Board[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, this.salt);
  }
}
