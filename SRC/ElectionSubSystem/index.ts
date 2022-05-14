import { ElectionDTO } from "./Domain/ElectionDTO";
import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { DbContext } from "./DataAccess/DbContext";

let specificConsumer: IConsumer = new APIConsumer([]);

async function syncAll() {
  let context = new DbContext();
  await context.createDatabase();
  let foundElection1 = await specificConsumer.getElection(7);
  let foundElection2 = await specificConsumer.getElection(8);
  let electionCommand = new ElectionCommand();
  electionCommand.addElections([foundElection1, foundElection2]);
}

syncAll();
