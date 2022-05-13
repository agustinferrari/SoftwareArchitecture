import { Election } from "./Domain/Election";
import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
let specificConsumer: IConsumer = new APIConsumer([]);

specificConsumer.getElections().then(
  (response: Election[]) => {
    console.log(response);
  },
  (error) => {
    console.log(error.message);
  }
);

// console.log(specificConsumer.getElection(1));
