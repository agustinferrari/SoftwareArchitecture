import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";

@Table
export class PersonModel extends Model {
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
}
