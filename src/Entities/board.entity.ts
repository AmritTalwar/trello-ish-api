import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  Unique,
  ManyToOne,
  ManyToMany,
} from "typeorm";

import { Team } from "./team.entity";
import { List } from "./list.entity";
import { User } from "./user.entity";

@Entity()
@Unique(["name", "ownerTeam"])
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.personalBoards, { nullable: true })
  ownerUser: User;

  @ManyToOne(() => Team, (team) => team.boards, { nullable: true })
  ownerTeam: Team;

  @OneToMany(() => List, (list) => list.board)
  lists: List[];

  async getOwners(): Promise<User[]> {
    const board: Board | undefined = await Board.findOne({
      where: { uuid: this.uuid },
      relations: ["ownerTeam", "ownerTeam.members", "ownerUser"],
    });

    if (!board) {
      return [];
    }

    if (board.ownerUser) {
      return [board.ownerUser];
    }
    return board.ownerTeam.members;
  }

  async getLists(): Promise<List[]> {
    const board: Board | undefined = await Board.findOne({
      where: { uuid: this.uuid },
      relations: ["lists"],
    });

    if (!board) {
      return [];
    }

    return board.lists;
  }
}
