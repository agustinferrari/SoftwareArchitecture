import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";

import { PartyModel } from "./PartyModel";

@Table
export class ElectionModel extends Model {
  @Column
  name!: string;

  @BelongsToMany(() => PartyModel, () => ElectionPartyModel)
  parties!: Array<PartyModel & { ElectionPartyModel: ElectionPartyModel }>;
  
  @PrimaryKey
  @Column
  id!: number;
}

@Table
export class ElectionPartyModel extends Model {
  @ForeignKey(() => ElectionModel)
  @Column
  electionId!: number;

  @ForeignKey(() => PartyModel)
  @Column
  partiID!: number;
}
