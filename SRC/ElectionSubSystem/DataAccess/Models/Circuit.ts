import {
  Table,
  Column,
  Model,
  PrimaryKey,
  BelongsToMany
} from "sequelize-typescript";
import { CircuitDTO } from "../../Domain/CircuitDTO";

import { Election, ElectionCircuit } from "./Election";

@Table
export class Circuit extends Model<CircuitDTO,CircuitDTO> {

  @PrimaryKey
  @Column
  id!: number;

  @Column
  state!: string;

  @Column
  location!: string;

  @BelongsToMany(() => Election, () => ElectionCircuit)
  elections!: Array<Election & { ElectionCircuit: ElectionCircuit }>;
}
