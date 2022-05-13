import {
  Table,
  Column,
  BelongsToMany,
  PrimaryKey,
  Model,
} from "sequelize-typescript";
import { VoterDTO } from "../../Domain/VoterDTO";
import {  ElectionCircuit, ElectionCircuitVoter } from "./Election";

@Table
export class Voter extends Model<VoterDTO,VoterDTO> {
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

  @BelongsToMany(() => ElectionCircuit, () => ElectionCircuitVoter)
  electionCircuitId!: number;

}
