// import { Election } from "./Domain/Election";
// import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
// import { IConsumer } from "./ElectoralConsumer/IConsumer";
// let specificConsumer: IConsumer = new APIConsumer([]);

// specificConsumer.getElections().then(
//   (response: Election[]) => {
//     console.log(response);
//   },
//   (error) => {
//     console.log(error.message);
//   }
// );

// console.log(specificConsumer.getElection(1));

import { Sequelize } from "sequelize-typescript";

import {
  ElectionModel,
  ElectionPartyModel,
  PartyModel,
  PersonModel,
  CandidateModel,
} from "./DataAccess/Models";

const sequelize = new Sequelize("mysql://root:password@127.0.0.1:3306/userDb");

sequelize.addModels([
  ElectionModel,
  PartyModel,
  ElectionPartyModel,
  PersonModel,
  CandidateModel,
]);

// PersonModel.sync({ alter: true }).then(() =>
//   PersonModel.create({
//     ci: "700000",
//     name: "Juan",
//     lastName: "Perez",
//     gender: "Flaco",
//     birthday: new Date(),
//   })
// );

PersonModel.create({
  ci: "999999",
  name: "Juan",
  lastName: "Perez",
  gender: "Flaco",
  birthday: new Date(),
}).then(() => console.log("Termino"));
console.log("Paso");

// const person = new PersonModel({ci: "59993342", name: 'Pepe', lastname: 'Sanchez', gender: 'No binario', date: new Date()});
// person.save();
//PersonModel.create({ci: "59993342", name: 'Pepe', lastname: 'Sanchez', gender: 'No binario', date: new Date()});

// const sequelize =  new Sequelize({
//   models: [__dirname + '/models/**/*.model.ts']
//   modelMatch: (filename, member) => {
//     return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
//   },
// });
