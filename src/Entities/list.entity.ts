import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Unique,
  ManyToOne,
  ManyToMany,
  OneToOne,
  getConnection,
} from "typeorm";

import { Board } from "./board.entity";
import { Task } from "./task.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["name", "board"])
export class List extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.list, { eager: true })
  tasks: Task[];

  @ManyToOne(() => Board, (board) => board.lists)
  board: Board;

  @Column()
  order: number;

  async getParentOwners(): Promise<User[]> {
    const list:
      | List
      | undefined = await getConnection()
      .createQueryBuilder()
      .select("list")
      .from(List, "list")
      .where("list.uuid = :uuid", { uuid: this.uuid })
      .leftJoinAndSelect("list.board", "board")
      .leftJoinAndSelect("board.ownerUser", "ownerUser")
      .leftJoinAndSelect("board.ownerTeam", "ownerTeam")
      .leftJoinAndSelect("ownerTeam.members", "members")
      .getOne();

    if (!list) {
      return [];
    }

    const listParentBoard: Board = list.board;

    if (listParentBoard.ownerUser) {
      return [listParentBoard.ownerUser];
    }
    return listParentBoard.ownerTeam.members;
  }

  async getTasks(): Promise<Task[]> {
    const list: List | undefined = await List.findOne({
      where: { uuid: this.uuid },
      relations: ["tasks"],
    });

    if (!list) {
      return [];
    }

    return list.tasks;
  }
}
