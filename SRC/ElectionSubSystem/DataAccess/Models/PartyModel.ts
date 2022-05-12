import {
  Table,
  Column,
  Model,
  HasMany,
  PrimaryKey,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";
import { Party } from "../../Domain/Party";
import { ElectionModel, ElectionPartyModel } from "./ElectionModel";


@Table
export class PartyModel extends Model {
  @Column
  name!: string;

  @PrimaryKey
  @Column
  id!: number;

  @BelongsToMany(() => ElectionModel, () => ElectionPartyModel)
  elections!: Array<ElectionModel & { ElectionPartyModel: ElectionPartyModel }>;
}
