import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";

import { PartySQL } from "./PartySQL";
import { VoterSQL } from "./VotersSQL";
import { CircuitSQL } from "./CircuitSQL";
import { Election } from "../../Common/Domain";
import { CandidateSQL } from "./CandidateSQL";

@Table
export class ElectionSQL extends Model<Election, Election> {
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

  @BelongsToMany(() => CandidateSQL, () => ElectionCandidateSQL)
  candidates!: Array<
    CandidateSQL & { ElectionCandidate: ElectionCandidateSQL }
  >;

  @BelongsToMany(() => CircuitSQL, () => ElectionCircuitSQL)
  circuits!: Array<PartySQL & { ElectionCircuit: ElectionCircuitSQL }>;
}

@Table
export class ElectionCandidateSQL extends Model {
  @ForeignKey(() => ElectionSQL)
  @Column
  electionId!: number;

  @ForeignKey(() => CandidateSQL)
  @Column
  candidateCI!: string;

  @Column
  voteCount!: number;
}

@Table
export class ElectionCircuitSQL extends Model {
  @PrimaryKey
  @Column
  electionCircuitId!: string;

  @ForeignKey(() => ElectionSQL)
  @Column
  electionId!: number;

  @ForeignKey(() => CircuitSQL)
  @Column
  circuitId!: number;

  @BelongsToMany(() => VoterSQL, () => ElectionCircuitVoterSQL)
  circuits!: Array<
    PartySQL & { ElectionCircuitVoter: ElectionCircuitVoterSQL }
  >;
}

@Table
export class ElectionCircuitVoterSQL extends Model {
  @ForeignKey(() => ElectionCircuitSQL)
  @Column
  electionCircuitId!: number;

  @ForeignKey(() => VoterSQL)
  @Column
  voterCI!: number;

  @Column
  voteCount!: number;
}
