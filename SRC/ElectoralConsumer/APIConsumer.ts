import axiosPackage from "axios";

import config from "config";
import {IConsumer} from './IConsumer';
import {Election} from './../Domain/Election';
import {HTTPRequestError} from './../Errors/HTTPRequestError';
import {Parameter} from './Parameter'
import { AxiosInstance } from "axios";

export class APIConsumer implements IConsumer {
  axios: AxiosInstance;

  constructor(parameters: Parameter[]) {
    this.axios = axiosPackage.create({baseURL: config.get("route")});
  }

  getElections() : Promise<Election[]>{
    let endpoint = "/elections";
    return this.genericGet(endpoint, "Error getting collections");
  }

  getElection(id: number): Promise<Election> {
    let endpoint = "/elections/" + id;
    return this.genericGet(endpoint, "Error on election get");
  }

  genericGet(endpoint: string, errorMessage: string) : Promise<any>{
    return new Promise((resolve, reject) => {
    this.axios
      .get<any>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        return resolve(response);
      })
      .catch(function (error) {
        return reject(
          new HTTPRequestError(errorMessage + " " + error.message)
        );
      })
      .then(function () {
        // always executed
      });
    });
  }
}

//TODO: Remove Magic Strings in configs in constructor
