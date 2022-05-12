import axiosPackage from "axios";

import config from "config";
import { IConsumer } from "./IConsumer";
import { Election } from "./../Domain/Election";
import { HTTPRequestError } from "./../Errors/HTTPRequestError";
import { Parameter } from "./Parameter";
import { AxiosInstance } from "axios";

export class APIConsumer implements IConsumer {
  axios: AxiosInstance;

  constructor(parameters: Parameter[]) {
    this.axios = axiosPackage.create({ baseURL: config.get("route") });
  }

  getElections(): Promise<Election[]> {
    let endpoint = "/elections";
    let errorMessage: string = "Error getting election";
    return this.axios
      .get<Election[]>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        return response.data.map((election) => new Election(election));
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
  }

  getElection(id: number): Promise<Election> {
    let endpoint: string = "/elections/" + id;
    let errorMessage: string = "Error getting election";
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

//TODO: Remove Magic Strings in configs in constructor
