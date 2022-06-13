import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IUser, UserDTO } from "../Models/User";
import config from "config";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";

export class VoteController {
  public static async getVote(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    let { electionId, voterCI } = req.body;
    if (!(electionId && voterCI)) {
      logger.logActivity("electionId or voterCI not provided", req.originalUrl);
      res.status(400).send("electionId or voterCI not provided");
    }

    let query = Query.getQuery();
  }
}
