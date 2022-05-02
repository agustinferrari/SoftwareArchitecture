const { APIConsumer } = require("./ElectoralAPIConsumer/APIConsumer");
let consumer = new APIConsumer("http://localhost:3000");

consumer.getElection(3).then(
  (elections) => {
    console.log("Funciono:");
    console.log(elections);
  },
  (error) => {
    console.log(error.message);
  }
);
