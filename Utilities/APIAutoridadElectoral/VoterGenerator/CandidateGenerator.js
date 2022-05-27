const { faker } = require('@faker-js/faker');

class CandidateGenerator {
  constructor(parties) {
    this.candidates = [];
    this.registeredCIs = [];
    this.parties = parties;
  }

  generateCandidate() {
    let ci = this.random_ci();
    let name = faker.name.firstName();
    let lastName = faker.name.lastName();
    let gender = faker.name.gender(true);
    let birthday = this.formatDate(faker.date.birthdate({ min: 18, max: 100, mode: 'age' }));
    let party = this.parties[Math.floor(Math.random()*this.parties.length)].id;

    let voter = { ci, name, lastName, gender, birthday, party };
    return voter;
  }

  generateCandidates(numberOfVoters) {
    for (let i = 0; i < numberOfVoters; i++) {
      this.candidates.push(this.generateCandidate());
    }
    return this.candidates;
  }

  validation_digit(ci) {
    var a = 0;
    var i = 0;
    if (ci.length <= 6) {
      for (i = ci.length; i < 7; i++) {
        ci = '0' + ci;
      }
    }
    for (i = 0; i < 7; i++) {
      a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
    }
    if (a % 10 === 0) {
      return 0;
    } else {
      return 10 - a % 10;
    }
  }

  random_ci() {
    var ci = Math.floor(Math.random() * (10000000 - 1000000 + 1) + 1000000).toString();
    ci = ci.substring(0, 7) + this.validation_digit(ci);
    while (this.registeredCIs.includes(ci)) {
      ci = Math.floor(Math.random() * (10000000 - 1000000 + 1) + 1000000).toString();
      ci = ci.substring(0, 7) + this.validation_digit(ci);
    }
    this.registeredCIs.push(ci);
    return ci;
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}

module.exports = CandidateGenerator;