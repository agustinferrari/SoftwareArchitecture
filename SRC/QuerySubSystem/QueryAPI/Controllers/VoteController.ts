import { Request, Response } from "express";
import { getUserInSession } from "../Helpers/jwtHelper";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";

export class VoteController {
  public static async getVote(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    const user: UserDTO = getUserInSession(req);
    let { electionId, voterCI } = req.body;
    if (!(electionId && voterCI)) {
      logger.logBadRequest("electionId or voterCI not provided", req.originalUrl, user);
      res.status(400).send("electionId or voterCI not provided");
    }

    let query = Query.getQuery();
    try {
      let result = await query.getVotes(electionId, voterCI);
      if (result.voteDates == []) {
        //TODO ver si 200 esta bien
        res.status(200).send("The voter has not voted yet");
      } else {
        res.status(200).send(result);
      }
    } catch (err) {
      logger.logBadRequest(`election ${electionId} does not exist`, req.originalUrl);
      res.status(404).send("Election " + electionId + " does not exist");
    }
  }
}
