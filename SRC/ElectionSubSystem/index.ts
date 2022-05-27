import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import { APIScheduler } from "./EventSchedulers/APIScheduler";
import { ElectionScheduler } from "./EventSchedulers/ElectionScheduler";
import { CandidateDTO, ElectionDTO } from "../Common/Domain";

import { ElectionCache, ElectionModel, RedisContext } from "./../Common/Redis";
import { INotificationSender } from "../Common/NotificationSender/INotificationSender";
import { EmailNotificationSender } from "../Common/NotificationSender/EmailNotificationSender";
import { SMSNotificationSender } from "../Common/NotificationSender/SMSNotificationSender";

let currentESender = new EmailNotificationSender([]);
let currentMSender = new SMSNotificationSender([]);

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

import { sequelizeContext, syncAllModels } from "../Common/Models";
import { PartyModel } from "../Common/Redis/PartyModel";
import { CandidateModel } from "../Common/Redis/CandidateModel";
import { AbstractAct } from "./Acts/AbstractAct";
import { StartAct } from "./Acts/StartAct";

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
// const scheduler = new APIScheduler();
// scheduler.startRecurrentGet();

async function addOneElection() {
  // await syncAllModels();

  let foundElection1 = await specificConsumer.getElection(7);
  let foundElection2 = await specificConsumer.getElection(8);
  let electionModel1 = new ElectionModel(foundElection1);
  let startAct: AbstractAct = new StartAct();

  startAct.generateAndSendAct(electionModel1, currentESender);

  // let electionCommand = new ElectionCommand();
  //electionCommand.addElections([foundElection1, foundElection2]);

  // let electionCache = new ElectionCache(new RedisContext());


  // electionCache.addElection(electionModel1);
  // // electionCache.addElection(
  // //   new ElectionModel(foundElection2.id, foundElection2.name, true)
  // // );

  // let result: ElectionModel | null = await electionCache.getElection(7);
  // console.log(result);
}
addOneElection();
