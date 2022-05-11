import {APIConsumer} from './ElectoralConsumer/APIConsumer'
import {IConsumer} from './ElectoralConsumer/IConsumer';
let specificConsumer : IConsumer = new APIConsumer([]);


specificConsumer.getElections().then(
  (elections) => {
    console.log("Funciono:");
    console.log(elections);
  },
  (error) => {
    console.log(error.message);
  }
);