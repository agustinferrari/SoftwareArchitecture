import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";
import { PersonDTO } from "../../Domain/PersonDTO";
@Table
export class Person extends Model<PersonDTO,PersonDTO> {
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
