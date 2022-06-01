const { faker } = require('@faker-js/faker');

class PartyGenerator {
  constructor() {
    this.parties = [];
    this.registeredCIs = [];
  }

  generateParty() {
    let id = faker.unique(faker.datatype.number);
    let name = faker.color.human();

    let voter = { id, name};
    return voter;
  }

  generateParties(numberOfVoters) {
    for (let i = 0; i < numberOfVoters; i++) {
      this.parties.push(this.generateParty());
    }
    return this.parties;
  }
}

module.exports = PartyGenerator;