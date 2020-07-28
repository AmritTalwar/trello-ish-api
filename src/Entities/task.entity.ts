import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
} from "typeorm";

import { User } from "./user.entity";
import { List } from "./list.entity";

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => List, (list) => list.tasks)
  list: List;

  @ManyToOne(() => User, (user) => user.tasks, { nullable: true })
  owner: User;

  @Column()
  order: number;
}
