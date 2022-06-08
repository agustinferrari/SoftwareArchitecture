import { Table, Column, Model, PrimaryKey } from "sequelize-typescript";
import { Person } from "../../Common/Domain";
@Table
export class PersonSQL extends Model<Person, Person> {
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
