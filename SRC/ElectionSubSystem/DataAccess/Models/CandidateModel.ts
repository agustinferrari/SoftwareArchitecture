import { Table, Column, ForeignKey } from "sequelize-typescript";
import { PersonModel } from "./PersonModel";
import { PartyModel } from "./PartyModel";

@Table
export class CandidateModel extends PersonModel {
  
    @ForeignKey(() => PartyModel)
    @Column
  partyId!: number;
}
