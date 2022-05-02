const Interface = require("es6-interface");
const { IConsumer } = require("./IConsumer");

class FacadeElectoralConsumer extends Interface(IConsumer) {
  constructor(electoralConsumer) {
    super();
    this.electoralConsumer = electoralConsumer;
  }

  getElections() {
    return this.electoralConsumer.getElections();
  }

  getElection(id) {
    return this.electoralConsumer.getElection(id);
  }
}

module.exports = { FacadeElectoralConsumer: FacadeElectoralConsumer };
