import {
  Table,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  BelongsToMany,
} from "sequelize-typescript";
import { PartySQL } from "./PartySQL";
import { Candidate } from "../Domain";
import { ElectionSQL, ElectionCandidateSQL } from "./ElectionSQL";

@Table
export class CandidateSQL extends Model<Candidate, Candidate> {
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

  @ForeignKey(() => PartySQL)
  @Column
  partyId!: number;

  @BelongsToMany(() => ElectionSQL, () => ElectionCandidateSQL)
  elections!: Array<ElectionSQL & { ElectionCandidate: ElectionCandidateSQL }>;
}
