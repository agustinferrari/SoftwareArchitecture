import { Request, Response } from "express";
import { getUserInSession } from "../Helpers/jwtHelper";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";

export class ElectionController {
  public static async getConfig(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();

    let query = Query.getQuery();

    const user: UserDTO = getUserInSession(req);

    if (await query.existsElection(parseInt(req.params.id))) {
      let settings = await query.getElectionConfig(parseInt(req.params.id));

      logger.logSuccessfulRequest(
        "User asked for election " + req.params.id + " notification settings",
        req.originalUrl,
        user
      );
      res.status(200).send(settings);
    } else {
      logger.logBadRequest(
        "User asked for election " +
          req.params.id +
          " notification settings || Election does not exists",
        req.originalUrl,
        user
      );
      res.status(404).send("Election " + req.params.id + " does not exists");
    }
  }
}
