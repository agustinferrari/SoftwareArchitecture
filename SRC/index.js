const { APIConsumer } = require("./ElectoralConsumer/APIConsumer");
const {
  FacadeElectoralConsumer,
} = require("./ElectoralConsumer/FacadeElectoralConsumer");
const {Parameter} = require("../Utilities/InterfaceUtilities/Parameter");
let consumerParameters = [new Parameter("http://localhost:3000", "API_Route")];
let specificConsumer = new APIConsumer(consumerParameters);
let facadeConsumer = new FacadeElectoralConsumer(specificConsumer);


facadeConsumer.getElection(2).then(
  (elections) => {
    console.log("Funciono:");
    console.log(elections);
  },
  (error) => {
    console.log(error.message);
  }
);