import {
  Table,
  Column,
  BelongsToMany,
  PrimaryKey,
  Model,
} from "sequelize-typescript";
import { Voter } from "../Domain";
import {  ElectionCircuitSQL, ElectionCircuitVoterSQL } from "./ElectionSQL";

@Table
export class VoterSQL extends Model<Voter,Voter> {
  @Column
  name!: string;

  @PrimaryKey
  @Column
  ci!: string;

  @Column
  birthday!: Date;

  @Column
  lastName!: string;

  @Column
  gender!: string;
  
  @Column
  residency!: string;

  @Column
  phone!: string;

  @Column
  email!: string;

  @Column
  credential!: string;

  @BelongsToMany(() => ElectionCircuitSQL, () => ElectionCircuitVoterSQL)
  electionCircuitId!: number;

}