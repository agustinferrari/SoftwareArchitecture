const unirest = require("unirest");
const Interface = require("es6-interface");
const { IConsumer } = require("./IConsumer");

const { HTTPRequestError } = require("../Errors/HTTPRequestError");

class APIConsumer extends Interface(IConsumer) {
  constructor(parameters) {
    super();
    let parameterName =  "API_Route";
    this.route = parameters.find((p) => p.name == parameterName).value;
  }

  getElections() {
    let endpoint = "/elections";
    return this.genericGet(endpoint, "Error getting collections");
  }

  getElection(id) {
    let endpoint = "/elections/" + id;
    return this.genericGet(endpoint, "Error on election get");
  }

  genericGet(endpoint, errorMessage) {
    return new Promise((resolve, reject) => {
      unirest.get(this.route + endpoint).then(function (response) {
        if (response.error) {
          return reject(
            new HTTPRequestError(errorMessage + " " + response.error.message)
          );
        }
        const result = response.body;
        return resolve(result);
      });
    });
  }
}

module.exports = { APIConsumer: APIConsumer };
