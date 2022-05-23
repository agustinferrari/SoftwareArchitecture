import {
  Table,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  BelongsToMany,
} from "sequelize-typescript";
import { Party } from "./Party";
import { CandidateDTO } from "../Domain";
import { Election, ElectionCandidate } from "./Election";

@Table
export class Candidate extends Model<CandidateDTO, CandidateDTO> {
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

  @ForeignKey(() => Party)
  @Column
  partyId!: number;

  @BelongsToMany(() => Election, () => ElectionCandidate)
  elections!: Array<Election & { ElectionCandidate: ElectionCandidate }>;
}
