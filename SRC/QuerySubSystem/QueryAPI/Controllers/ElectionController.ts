import { NextFunction, Request, Response } from "express";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { INotificationSettings } from "../Models/NotificationSettings";
import { ElectionNotFound } from "../Errors/ElectionNotFound";
import { Command } from "../../DataAccess/Command/Command";
import { TimeStampHelper } from "../Helpers/TimeStampHelper";

export class ElectionController {

  public static async getConfig(req: Request, res: Response, next: NextFunction) {
    let requestTimeStamp : Date = new Date();
    const logger = LoggerFacade.getLogger();

    let query = Query.getQuery();

    const user: UserDTO = res.locals.userDTO;

    if (await query.existsElection(parseInt(req.params.id))) {
      let settings = await query.getElectionConfig(parseInt(req.params.id));

      logger.logSuccessfulRequest("User asked for election " + req.params.id + " notification settings", req.originalUrl, user);
      res.locals.timeStampHelper = new TimeStampHelper(settings, 200, requestTimeStamp, new Date());
      next();
    } else {
      logger.logBadRequest("User asked for election " + req.params.id + " notification settings || Election does not exists", req.originalUrl, user);
      res.locals.timeStampHelper = new TimeStampHelper(`Election ${req.params.id} does not exists`, 400, requestTimeStamp, new Date());
      next();
    }
  }

  public static async getVoteFrequency(req: Request, res: Response, next : NextFunction) {
    let requestTimeStamp : Date = new Date();
    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);

    if (!id) {
      let errorMessage : string = "electionId not provided";
      try {
        const user: UserDTO = res.locals.userDTO;
        logger.logBadRequest(errorMessage, req.originalUrl, user);
      } catch (err) {
        logger.logBadRequest(errorMessage, req.originalUrl);
      }
      res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 400, requestTimeStamp, new Date());
      next();
    }

    let query = Query.getQuery();
    try {
      let result = await query.getVoteFrequency(id);
      let queryResult :any;
      queryResult = result;
      if (result.dateFrequencies == []) {
        queryResult = "Election has no votes";
      }
      res.locals.timeStampHelper =  new TimeStampHelper(queryResult, 200, requestTimeStamp, new Date());
      next();
    } catch (err) {
      let errorMessage : string = `election ${id} does not exist`;
      logger.logBadRequest(errorMessage, req.originalUrl);
      res.locals.timeStampHelper =  new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
      next();
    }
  }

  public static async getCircuitInfo(req: Request, res: Response, next : NextFunction) {
    let requestTimeStamp : Date = new Date();

    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    let { minAge, maxAge, rangeSpace } = req.body;
    let query = Query.getQuery();
    try {
      let result = await query.getElectionInfoCountPerCircuit(id, minAge, maxAge, rangeSpace);
      res.locals.timeStampHelper =  new TimeStampHelper(result, 200, requestTimeStamp, new Date());
      next();
    } catch (err) {
      let errorMessage = `Election ${id} does not exist`;
      logger.logBadRequest(errorMessage, req.originalUrl);
      res.locals.timeStampHelper =  new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
      next();
    }
  }

  public static async getStateInfo(req: Request, res: Response, next : NextFunction) {
    let requestTimeStamp : Date = new Date();

    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    let { minAge, maxAge, rangeSpace } = req.body;
    let query = Query.getQuery();
    try {
      let result = await query.getElectionInfoCountPerState(id, minAge, maxAge, rangeSpace);
      res.locals.timeStampHelper =  new TimeStampHelper(result, 200, requestTimeStamp, new Date());
      next();
    } catch (err) {
      let errorMessage = `Election ${id} does not exist`;
      logger.logBadRequest(errorMessage, req.originalUrl);
      res.locals.timeStampHelper =  new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
      next();
    }
  }

  public static async getElectionInfo(req: Request, res: Response, next: NextFunction) {
    let requestTimeStamp : Date = new Date();
    const logger = LoggerFacade.getLogger();
    let id = parseInt(req.params.id);
    let query = Query.getQuery();
    try {
      let result = await query.getElectionInfo(id);
      res.locals.timeStampHelper =  new TimeStampHelper(result, 200, requestTimeStamp, new Date());
      next();
    } catch (err) {
      let errorMessage = `Election ${id} does not exist`;
      logger.logBadRequest(errorMessage, req.originalUrl);
      res.locals.timeStampHelper =  new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
      next();
    }
  }

  static setSettings = async (req: Request, res: Response, next : NextFunction) => {
    let requestTimeStamp : Date = new Date();
    try {
      const settings: INotificationSettings = req.body;
      settings.electionId = parseInt(req.params.id);
      const updated = await Command.getCommand().updateNotificationSettings(settings);

      let message = "Notification settings for election " + settings.electionId + " updated: " + JSON.stringify(updated);

      res.locals.timeStampHelper =  new TimeStampHelper(message, 200, requestTimeStamp, new Date());
      next();
    } catch (error: any) {
      if (error instanceof ElectionNotFound) {

        res.locals.timeStampHelper =  new TimeStampHelper(error.message, 404, requestTimeStamp, new Date());
        next();
        
      } else {
        console.log(error.message);
        let errorMessage = "Invalid request: Incorrect format. Format: {maxVotesPerVoter: number, maxVoteReportRequestsPerVoter: number, emailsSubscribed: string[]}";
        res.locals.timeStampHelper =  new TimeStampHelper(errorMessage, 400, requestTimeStamp, new Date());
        next();
      }
      return;
    }
  };
}
