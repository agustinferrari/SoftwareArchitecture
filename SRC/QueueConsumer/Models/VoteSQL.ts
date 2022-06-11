import { Table, Column, PrimaryKey, ForeignKey, Model } from "sequelize-typescript";
import { Vote } from "../../Common/Domain/Vote";
import { ElectionSQL } from "./ElectionSQL";
import { VoterSQL } from "./VotersSQL";

@Table
export class VoteSQL extends Model<Vote, Vote> {
  @PrimaryKey
  @Column
  id!: string;

  @Column
  startTimestamp!: Date;

  @Column
  endTimestamp!: Date;

  @Column
  responseTime!: number;

  @ForeignKey(() => VoterSQL)
  @Column
  voterCI!: string;

  @ForeignKey(() => ElectionSQL)
  @Column
  electionId!: number;
}
