import Axios, { AxiosInstance } from "axios";
import config from "config";
import { IConsumer } from "./IConsumer";
import { ElectionDTO, VoterDTO } from "../../Common/Domain";
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
  ): Promise<VoterDTO[]> {
    let endpoint: string = "/voters";
    let specifyElection: string = "?electionId=" + electionId;
    let specifyPage : string = "&_page=" + page;
    let specifyLimit : string ="&_limit=" + pageSize;
    let errorMessage: string =
      "Error getting voters for election " + electionId;
    electionId;

    let finalEndpoint : string = endpoint + specifyElection + specifyPage + specifyLimit;
    return this.axios
      .get<VoterDTO[]>(finalEndpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(function (response) {
        let result: VoterDTO[] = response.data.map(
          (election) => new VoterDTO(election)
        );
        return result;
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
  }

  async getElections(includeVoters: boolean): Promise<ElectionDTO[]> {
    let endpoint: string = "/elections";

    let errorMessage: string = "Error getting election";
    let voterPageLimit : number = config.get("API.electionsVoterPageLimit");
    let resultingElections : ElectionDTO[] = [];

    let found :Promise<void> =  this.axios
      .get<ElectionDTO[]>(endpoint, {
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        response.data.map(
          async (election) => {
            let resultingElection = new ElectionDTO(election);
            if(includeVoters) {
              let withVoters : ElectionDTO = await this.getElectionsWithVoterHandler(resultingElection, voterPageLimit);
              resultingElections.push(withVoters);
            }else{
              resultingElections.push(resultingElection);
            }
          }
        );
      })
      .catch(function (error) {
        throw new HTTPRequestError(errorMessage + " " + error.message);
      });
    await found;
    return resultingElections;
  }

  private async getElectionsWithVoterHandler(election : ElectionDTO, voterPageLimit : number): Promise<ElectionDTO> {
    let resultingElection = new ElectionDTO(election);
    return new Promise<ElectionDTO>((resolve, reject) => {
      this.getVoterPaginated(resultingElection.id, 1, voterPageLimit)
        .then((voters) => {
          resultingElection.voters = voters;
          resolve(resultingElection);
        }).catch((error)=>{
          reject(error);
        });
    });
  }

  getElection(id: number, includeVoters: boolean): Promise<ElectionDTO> {
    let endpoint: string = "/elections/" + id;
    let errorMessage: string = "Error getting election";

    if (includeVoters) endpoint += this.embedVoters;

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

