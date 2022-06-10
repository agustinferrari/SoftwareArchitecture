const { faker } = require("@faker-js/faker");
const { generateKeyPairSync } = require("crypto");
const fs = require("fs");
const readlines = require("n-readlines");
let fileName = "../private-public-keys.txt";
const liner = new readlines(fileName);

class VoterGenerator {
  constructor() {
    this.voters = [];
    this.registeredCIs = [];
    this.currentCi = 0;
  }

  generateKeys() {
    let keyPair = generateKeyPairSync("rsa", {
      modulusLength: 512,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    let publicKey = keyPair.publicKey;
    let privateKey = keyPair.privateKey;
    let keys = { publicKey, privateKey };
    return keys;
  }


  getKeys() {
    let next = liner.next()
    if(!next){
      throw new Error("Run out of keys");
    }
    return JSON.parse(next.toString());
  }

  generateVoter(electionid) {
    let ci = this.random_ci();
    let credential = faker.database.mongodbObjectId();
    let name = faker.name.firstName();
    let lastName = faker.name.lastName();
    let gender = faker.name.gender(true);
    let birthday = this.formatDate(
      faker.date.birthdate({ min: 18, max: 100, mode: "age" })
    );
    let residency = faker.address.cityName();
    let phone = faker.phone.phoneNumber("+598 ## ######");
    let email = faker.internet.email();
    // let circuitId =
    //   this.circuits[Math.floor(Math.random() * this.circuits.length)].id;
    let circuitId = -1;
    let electionId = electionid;
    let keys = this.getKeys();
    let publicKey = keys.publicKey;
    let privateKey = keys.privateKey;
    let voter = {
      ci,
      credential,
      name,
      lastName,
      gender,
      birthday,
      residency,
      phone,
      email,
      circuitId,
      electionId,
      publicKey,
      privateKey,
    };
    return voter;
  }

  generateVoters(numberOfVoters) {
    let defaultId = -1;
    for (let i = 0; i < numberOfVoters; i++) {
      this.voters.push(this.generateVoter(defaultId));
      clearLastLine();
      process.stdout.write(
        "\nCurrent voters: " +
          i.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
          "\r"
      );
    }
    return this.voters;
  }

  validation_digit(ci) {
    var a = 0;
    var i = 0;
    if (ci.length <= 6) {
      for (i = ci.length; i < 7; i++) {
        ci = "0" + ci;
      }
    }
    for (i = 0; i < 7; i++) {
      a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
    }
    if (a % 10 === 0) {
      return 0;
    } else {
      return 10 - (a % 10);
    }
  }

  random_ci() {
    // var ci = Math.floor(Math.random() * (10000000 - 1000000 + 1) + 1000000).toString();
    // ci = ci.substring(0, 7) + this.validation_digit(ci);
    // while (this.registeredCIs.includes(ci)) {
    //   ci = Math.floor(Math.random() * (10000000 - 1000000 + 1) + 1000000).toString();
    //   ci = ci.substring(0, 7) + this.validation_digit(ci);
    // }
    // this.registeredCIs.push(ci);

    var ci = (this.currentCi + 1000000).toString();
    this.currentCi++;
    ci = ci.substring(0, 7) + this.validation_digit(ci);
    return ci;
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}

const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

const clearLastLine = () => {
  process.stdout.write(CSI + "A"); // moves cursor up one line
  process.stdout.write(CSI + "K"); // clears from cursor to line end
};

module.exports = VoterGenerator;
