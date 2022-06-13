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
  }
}
