import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";

import { Party } from "./Party";
import { Voter } from "./Voter";
import { Circuit } from "./Circuit";
import { ElectionDTO } from "../../Domain/ElectionDTO";
import { Candidate } from "./Candidate";

@Table
export class Election extends Model<ElectionDTO, ElectionDTO> {
  @Column
  name!: string;

  @PrimaryKey
  @Column
  id!: number;

  @Column
  description!: string;

  @Column
  startDate!: Date;

  @Column
  endDate!: Date;

  @Column
  mode!: string;

  @BelongsToMany(() => Candidate, () => ElectionCandidate)
  candidates!: Array<Candidate & { ElectionCandidate: ElectionCandidate }>;

  @BelongsToMany(() => Circuit, () => ElectionCircuit)
  circuits!: Array<Party & { ElectionCircuit: ElectionCircuit }>;
}

@Table
export class ElectionCandidate extends Model {
  @ForeignKey(() => Election)
  @Column
  electionId!: number;

  @ForeignKey(() => Candidate)
  @Column
  candidateCI!: string;
}

@Table
export class ElectionCircuit extends Model {
  @PrimaryKey
  @Column
  electionCircuitId!:string;
  
  @ForeignKey(() => Election)
  @Column
  electionId!: number;

  @ForeignKey(() => Circuit)
  @Column
  circuitId!: number;

  @BelongsToMany(() => Voter, () => ElectionCircuitVoter)
  circuits!: Array<Party & { ElectionCircuitVoter: ElectionCircuitVoter }>;
}

@Table
export class ElectionCircuitVoter extends Model {
  @ForeignKey(() => ElectionCircuit)
  @Column
  electionCircuitId!: number;

  @ForeignKey(() => Voter)
  @Column
  voterCI!: number;
}
