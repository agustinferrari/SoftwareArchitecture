import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import {APIScheduler} from "./EventSchedulers/APIScheduler";
import {ElectionScheduler} from "./EventSchedulers/ElectionScheduler";
import { ElectionDTO } from "../Common/Domain";

let specificConsumer: IConsumer = new APIConsumer([]);

import {
  Election,
  ElectionCandidate,
  ElectionCircuit,
  ElectionCircuitVoter,
  Party,
  Person,
  Candidate,
  Voter,
  Circuit,
} from "../Common/Models";

import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { Sequelize } from "sequelize-typescript";

import { sequelizeContext, syncAllModels } from "../Common/Models";

sequelizeContext.addModels([
  Election,
  ElectionCandidate,
  ElectionCircuitVoter,
  ElectionCircuit,
  Circuit,
  Party,
  Voter,
  Candidate,
]);

// Se inicia la accion recurrente de get Elections
const scheduler = new APIScheduler();
scheduler.startRecurrentGet();

const e1 = new ElectionDTO( {
  "id": 8,
  "name": "Intendencia",
  "description": "Eleccion intendencia",
  "startDate": "2000-11-05 12:11:10",
  "endDate": "2000-11-05 20:30:40",
  "mode": "unique",
  "voters": [
    {
      "ci": "111111111",
      "credential": "CredencialUno",
      "name": "Unos",
      "lastName": "UnosUnos",
      "gender": "male",
      "birthday": "2000-11-05",
      "residency": "Montevideo",
      "circuitId": 3,
      "phone": "11111",
      "email": "unos@gmail.com"
    },
    {
      "ci": "3333333333",
      "credential": "CredencialTres",
      "name": "Tres",
      "lastName": "TresTres",
      "gender": "not disclosed",
      "birthday": "2001-01-02",
      "residency": "Montevideo",
      "circuitId": 4,
      "phone": "333",
      "email": "tres@yahoo.com"
    },
    {
      "ci": "444444444",
      "credential": "CredencialCuatro",
      "name": "Cuatros",
      "lastName": "CuatrosCuatros",
      "gender": "male",
      "birthday": "2020-11-05",
      "residency": "Montevideo",
      "circuitId": 2,
      "phone": "4444444",
      "email": "cuatros@gmail.com"
    }
  ],
  "candidates": [
    {
      "ci": "3333333333",
      "credential": "CredencialTres",
      "name": "Tres",
      "lastName": "TresTres",
      "gender": "not disclosed",
      "birthday": "2001-01-02",
      "partyId": 1
    }
  ],
  "parties": [
    {
      "id": 3,
      "name": "Rojo"
    },
    {
      "id": 2,
      "name": "Violeta"
    }
  ],
  "circuits": [
    {
      "id": 4,
      "state": "Canelones",
      "location": "Fuera"
    },
    {
      "id": 2,
      "state": "Colonia",
      "location": "Centro"
    },
    {
      "id": 3,
      "state": "Artigas",
      "location": "centro"
    }
  ]
});
e1.id = 1;
e1.startDate = "2022-05-23 17:02:00";
e1.endDate = "2022-05-23 17:02:20";

const e2 = new ElectionDTO( {
  "id": 8,
  "name": "Intendencia",
  "description": "Eleccion intendencia",
  "startDate": "2000-11-05 12:11:10",
  "endDate": "2000-11-05 20:30:40",
  "mode": "unique",
  "voters": [
    {
      "ci": "111111111",
      "credential": "CredencialUno",
      "name": "Unos",
      "lastName": "UnosUnos",
      "gender": "male",
      "birthday": "2000-11-05",
      "residency": "Montevideo",
      "circuitId": 3,
      "phone": "11111",
      "email": "unos@gmail.com"
    },
    {
      "ci": "3333333333",
      "credential": "CredencialTres",
      "name": "Tres",
      "lastName": "TresTres",
      "gender": "not disclosed",
      "birthday": "2001-01-02",
      "residency": "Montevideo",
      "circuitId": 4,
      "phone": "333",
      "email": "tres@yahoo.com"
    },
    {
      "ci": "444444444",
      "credential": "CredencialCuatro",
      "name": "Cuatros",
      "lastName": "CuatrosCuatros",
      "gender": "male",
      "birthday": "2020-11-05",
      "residency": "Montevideo",
      "circuitId": 2,
      "phone": "4444444",
      "email": "cuatros@gmail.com"
    }
  ],
  "candidates": [
    {
      "ci": "3333333333",
      "credential": "CredencialTres",
      "name": "Tres",
      "lastName": "TresTres",
      "gender": "not disclosed",
      "birthday": "2001-01-02",
      "partyId": 1
    }
  ],
  "parties": [
    {
      "id": 3,
      "name": "Rojo"
    },
    {
      "id": 2,
      "name": "Violeta"
    }
  ],
  "circuits": [
    {
      "id": 4,
      "state": "Canelones",
      "location": "Fuera"
    },
    {
      "id": 2,
      "state": "Colonia",
      "location": "Centro"
    },
    {
      "id": 3,
      "state": "Artigas",
      "location": "centro"
    }
  ]
});
e2.id = 2;
e2.startDate = "2022-05-23 17:02:10";
e2.endDate = "2022-05-23 17:02:25";

const EScheduler = new ElectionScheduler();
EScheduler.scheduleStartElection(e1);
EScheduler.scheduleEndElection(e1);

EScheduler.scheduleStartElection(e2);
EScheduler.scheduleEndElection(e2);


// async function addOneElection() {

//   await syncAllModels();

//   let foundElection1 = await specificConsumer.getElection(7);
//   let foundElection2 = await specificConsumer.getElection(8);
//   let electionCommand = new ElectionCommand();
//   electionCommand.addElections([foundElection1, foundElection2]);

// }
// addOneElection();

