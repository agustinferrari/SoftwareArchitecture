import axiosPackage from "axios";

import config from "config";
import { IConsumer } from "./IConsumer";
import { ElectionDTO } from "../Domain/ElectionDTO";
import { HTTPRequestError } from "./../Errors/HTTPRequestError";
import { Parameter } from "./Parameter";
import { AxiosInstance } from "axios";

export class APIConsumer implements IConsumer {
  axios: AxiosInstance;

  constructor(parameters: Parameter[]) {
    this.axios = axiosPackage.create({ baseURL: config.get("API.route") });
  }

  getElections(): Promise<ElectionDTO[]> {
    let endpoint = "/elections";
    let errorMessage: string = "Error getting election";
    return this.axios
      .get<ElectionDTO[]>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        return response.data.map((election) => new ElectionDTO(election));
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
  }

  getElection(id: number): Promise<ElectionDTO> {
    let endpoint: string = "/elections/" + id;
    let errorMessage: string = "Error getting election";
    return this.axios
      .get<ElectionDTO>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        return new ElectionDTO(response.data);
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
  }
}

//TODO: Remove Magic Strings in configs in constructor
