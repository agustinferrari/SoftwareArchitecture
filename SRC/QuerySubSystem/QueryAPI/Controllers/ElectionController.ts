import { Request, Response } from "express";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { INotificationSettings } from "../Models/NotificationSettings";
import { ElectionNotFound } from "../Errors/ElectionNotFound";
import { Command } from "../../DataAccess/Command/Command";

export class ElectionController {
  public static async getConfig(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();

    let query = Query.getQuery();

    const user: UserDTO = res.locals.userDTO;

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

  public static async getVoteFrequency(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    if (!id) {
      try {
        const user: UserDTO = res.locals.userDTO;
        logger.logBadRequest("electionId not provided", req.originalUrl, user);
      } catch (err) {
        logger.logBadRequest("electionId not provided", req.originalUrl);
      }
      res.status(400).send("electionId not provided");
    }

    let query = Query.getQuery();
    try {
      let result = await query.getVoteFrequency(id);
      if (result.dateFrequencies == []) {
        res.status(200).send("Election has no votes");
      } else {
        res.status(200).send(result);
      }
    } catch (err) {
      logger.logBadRequest(`election ${id} does not exist`, req.originalUrl);
      res.status(404).send("Election " + req.params.id + " does not exist");
    }
  }

  public static async getCircuitInfo(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    let { minAge, maxAge, gender } = req.body;
    let query = Query.getQuery();
    try {
      let result = await query.getElectionInfoCountPerCircuit(id, minAge, maxAge, gender);
      res.status(200).send(result);
    } catch (err) {
      logger.logBadRequest(`election ${id} does not exist`, req.originalUrl);
      res.status(404).send("Election " + req.params.id + " does not exist");
    }
  }

  public static async getStateInfo(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    let { minAge, maxAge, gender } = req.body;
    let query = Query.getQuery();
    try {
      let result = await query.getElectionInfoCountPerState(id, minAge, maxAge, gender);
      res.status(200).send(result);
    } catch (err) {
      logger.logBadRequest(`election ${id} does not exist`, req.originalUrl);
      res.status(404).send("Election " + req.params.id + " does not exist");
    }
  }

  public static async getElectionInfo(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    let query = Query.getQuery();
    try {
      let result = await query.getElectionInfo(id);
      res.status(200).send(result);
    } catch (err) {
      logger.logBadRequest(`election ${id} does not exist`, req.originalUrl);
      res.status(404).send("Election " + req.params.id + " does not exist");
    }
  }

  static setSettings = async (req: Request, res: Response) => {
    try {
      const settings: INotificationSettings = req.body;
      settings.electionId = parseInt(req.params.id);
      const updated = await Command.getCommand().updateNotificationSettings(settings);

      res
        .status(200)
        .send(
          "Notification settings for election " +
            settings.electionId +
            " updated: " +
            JSON.stringify(updated)
        );
    } catch (error: any) {
      if (error instanceof ElectionNotFound) {
        res.status(404).send(error.message);
      } else {
        console.log(error.message);
        res
          .status(400)
          .send(
            "Invalid request: Incorrect format. Format: {maxVotesPerVoter: number, maxVoteReportRequestsPerVoter: number, emailsSubscribed: string[]}"
          );
      }
      return;
    }
  };
}
