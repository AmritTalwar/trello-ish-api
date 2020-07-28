import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Unique,
  ManyToOne,
} from "typeorm";

import { Board } from "./board.entity";
import { Task } from "./task.entity";

@Entity()
@Unique(["name", "board"])
export class List extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.list)
  tasks: Task[];

  @ManyToOne(() => Board, (board) => board.lists)
  board: Board;

  @Column()
  order: number;
}
