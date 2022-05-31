const { faker } = require('@faker-js/faker');

class CircuitGenerator {
  constructor() {
    this.circuits = [];
  }

  generateCircuit() {
    let id = faker.unique(faker.datatype.number);
    let state = faker.address.cityName();
    let location = faker.address.city();

    let circuit = { id, state, location};
    return circuit;
  }

  generateCircuits(numberOfCircuits) {
    for (let i = 0; i < numberOfCircuits; i++) {
      this.circuits.push(this.generateCircuit());
    }
    return this.circuits;
  }
}

module.exports = CircuitGenerator;