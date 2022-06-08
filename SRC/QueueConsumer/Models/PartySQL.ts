import {
  Table,
  Column,
  Model,
  PrimaryKey,
  HasMany,
} from "sequelize-typescript";

import { CandidateSQL } from "./CandidateSQL";
import { Party } from "../../Common/Domain";

@Table
export class PartySQL extends Model<Party, Party> {
  @Column
  name!: string;

  @PrimaryKey
  @Column
  id!: number;

  @HasMany(() => CandidateSQL)
  candidates!: CandidateSQL[];
}
