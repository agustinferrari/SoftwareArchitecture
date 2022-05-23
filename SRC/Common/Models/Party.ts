import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";

import {Candidate} from "./Candidate";
import { PartyDTO } from "../Domain/PartyDTO";

@Table
export class Party extends Model<PartyDTO,PartyDTO> {
  @Column
  name!: string;

  @PrimaryKey
  @Column
  id!: number;

  @HasMany(() => Candidate)
  candidates!: Candidate[]
  
}
