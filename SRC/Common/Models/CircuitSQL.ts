import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany
} from "sequelize-typescript";
import { Circuit } from "../Domain/Circuit";

import { ElectionSQL, ElectionCircuitSQL } from "./ElectionSQL";

@Table
export class CircuitSQL extends Model<Circuit,Circuit> {

  @PrimaryKey
  @Column
  id!: number;

  @Column
  state!: string;

  @Column
  location!: string;

  @BelongsToMany(() => ElectionSQL, () => ElectionCircuitSQL)
  elections!: Array<ElectionSQL & { ElectionCircuit: ElectionCircuitSQL }>;
}
