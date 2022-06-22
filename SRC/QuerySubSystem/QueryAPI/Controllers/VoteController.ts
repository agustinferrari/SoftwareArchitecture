import { NextFunction, Request, Response } from "express";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { ElectionInfo, VoteProof, Voter } from "../../../Common/Domain";
import { NotificationHelper } from "../Helpers/NotificationHelper";
import { INotificationSender } from "../../../Common/NotificationSender";
import { Command } from "../../DataAccess/Command/Command";
import { ElectionNotFound } from "../Errors/ElectionNotFound";
import { TimeStampHelper } from "../Helpers/TimeStampHelper";

export class VoteController {
  public static async getVote(req: Request, res: Response, next : NextFunction) {
    let requestTimeStamp:Date = new Date();
    const logger = LoggerFacade.getLogger();
    const user: UserDTO = res.locals.userDTO;
    let { electionId, voterCI } = req.body;

    if (!(electionId && voterCI)) {
      let errorMessage = "electionId or voterCI not provided";
      logger.logBadRequest(errorMessage, req.originalUrl, user);
      res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 400, requestTimeStamp, new Date());
      next();
    }

    let query = Query.getQuery();
    try {
      let result = await query.getVotes(electionId, voterCI);
      let queryResult : any = result;
      let code = 200;
      if (result.voteDates == []) {
        queryResult = "The voter has not voted yet";
        code = 404;
      }

      res.locals.timeStampHelper = new TimeStampHelper(queryResult, code, requestTimeStamp, new Date());
      next();
    } catch (err: any) {
      if (err instanceof ElectionNotFound) {
        let errorMessage = `Election ${electionId} does not exist`;

        logger.logBadRequest(errorMessage, req.originalUrl);
        res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
        next();
      } else {
        logger.logBadRequest(err.message, req.originalUrl);
        res.locals.timeStampHelper = new TimeStampHelper(err.message, 400, requestTimeStamp, new Date());
        next();
      }
    }
  }

  public static async getVoteProof(req: Request, res: Response, next: NextFunction) {
    let requestTimeStamp:Date = new Date();

    const logger = LoggerFacade.getLogger();

    let { voterCI, voteId } = req.body;

    if (!(voteId && voterCI)) {
      let errorMessage = "voteId or voterCI not provided";
      logger.logBadRequest(errorMessage, req.originalUrl);
      res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 400, requestTimeStamp, new Date());
      next();
    }

    let command = Command.getCommand();
    let query = Query.getQuery();
    let notificationSender: NotificationHelper = NotificationHelper.getNotificationHelper();

    try {
      let vote = await query.getVote(voteId, voterCI);

      if (!vote) {
        let errorMessage ="vote not found";
        logger.logBadRequest(errorMessage, req.originalUrl);
        res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
        next();
        return;
      }

      let voter: Voter = await query.getVoter(voterCI);
      let election: ElectionInfo = await query.getElection(vote.electionId);

      if (!voter || !election) {
        let errorMessage = "voter or election not found";
        logger.logBadRequest(errorMessage, req.originalUrl);
        res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
        next();
        return;
      }

      let voteProofRequestCount: number = await query.getVoteProofLogCount(voterCI, election.id);
      let maxRequestsAllowed: number = election.maxVoteRecordRequestsPerVoter;
      if (voteProofRequestCount >= maxRequestsAllowed) {
        command.AddVoteProofLog(voterCI, new Date(), election.id, true);
        let errorMessage = `voter ${voterCI} already requested the maximum amount of voter proofs for election ${election.id}`;
        notificationSender.alertSender.sendNotification(errorMessage, election.emails);
        logger.logBadRequest(errorMessage, req.originalUrl);
        res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 400, requestTimeStamp, new Date());
        next();
        return;
      }

      let voteProof: VoteProof = new VoteProof(vote, voter, election);
      let sender: INotificationSender = notificationSender.voteProofSender;

      sender.sendNotification(voteProof.ToString(), [voter.email]);
      command.AddVoteProofLog(voterCI, new Date(), election.id, false);

      res.locals.timeStampHelper = new TimeStampHelper(`Vote Proof sent to email`, 200, requestTimeStamp, new Date());
      next();
    } catch (err) {
      let errorMessage = "vote not found";
      logger.logBadRequest("vote not found", req.originalUrl);
      res.locals.timeStampHelper = new TimeStampHelper(errorMessage, 404, requestTimeStamp, new Date());
      next();
    }
  }
}
