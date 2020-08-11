import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  OneToMany,
  OneToOne,
  getConnection,
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

  @OneToOne(() => User, (user) => user.assignedTasks, { nullable: true })
  assignee: User;

  @Column()
  order: number;

  async getParentOwners(): Promise<User[]> {
    const task: Task | undefined = await Task.findOne({
      where: { uuid: this.uuid },
      relations: ["list.board.ownerUser", "list.board.ownerTeam.members"],
    });

    if (!task) {
      return [];
    }

    if (task.list.board.ownerUser) {
      return [task.list.board.ownerUser];
    }
    return task.list.board.ownerTeam.members;
  }
}
