import Axios, { AxiosInstance } from "axios";
import config from "config";
import { IConsumer } from "./IConsumer";
import { Election, Voter } from "../../Common/Domain";
import { HTTPRequestError } from "./../Errors/HTTPRequestError";
import { Parameter } from "./Parameter";

export class APIConsumer implements IConsumer {
  axios: AxiosInstance;
  embedVoters: string;

  constructor(parameters: Parameter[]) {
    parameters;
    this.axios = Axios.create({ baseURL: config.get("API.route") });
    this.embedVoters = "?_embed=voters";
  }
  getVoterPaginated(
    electionId: number,
    page: number,
    pageSize: number
  ): Promise<Voter[]> {
    let endpoint: string = "/voters";
    let specifyElection: string = "?electionId=" + electionId;
    let specifyPage: string = "&page=" + page;
    let specifyLimit: string = "&limit=" + pageSize;
    let errorMessage: string =
      "Error getting voters for election " + electionId;
    electionId;

    let finalEndpoint: string =
      endpoint + specifyElection + specifyPage + specifyLimit;
    return this.axios
      .get<Voter[]>(finalEndpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        let result: Voter[] = response.data.map(
          (election) => new Voter(election)
        );
        return result;
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
  }

  async getElections(includeVoters: boolean): Promise<Election[]> {
    let endpoint: string = "/elections";

    let errorMessage: string = "Error getting election";
    let voterPageLimit: number = config.get("API.electionsVoterPageLimit");
    let resultingElections: Election[] = [];
    let found: Promise<void> = this.axios
      .get<Election[]>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(async (response) => {

        for (let election of response.data) {
          let resultingElection = new Election(election);
          if (includeVoters) {
            let withVoters: Election =
              await this.getElectionsWithVoterHandler(
                resultingElection,
                voterPageLimit
              );
            resultingElections.push(withVoters);
          } else {
            resultingElections.push(resultingElection);
          }
        }
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
    await found;
    return resultingElections;
  }

  private async getElectionsWithVoterHandler(
    election: Election,
    voterPageLimit: number
  ): Promise<Election> {
    let resultingElection = new Election(election);
    return new Promise<Election>((resolve, reject) => {
      this.getVoterPaginated(resultingElection.id, 1, voterPageLimit)
        .then((voters) => {
          resultingElection.voters = voters;
          resolve(resultingElection);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getElection(id: number, includeVoters: boolean): Promise<Election> {
    let endpoint: string = "/elections/" + id;
    let errorMessage: string = "Error getting election";

    if (includeVoters) endpoint += this.embedVoters;

    return this.axios
      .get<Election>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        return new Election(response.data);
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
  }
}
