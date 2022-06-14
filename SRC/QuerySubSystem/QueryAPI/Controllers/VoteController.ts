import { Request, Response } from "express";
import { getUserInSession } from "../Helpers/jwtHelper";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { ElectionInfo, VoteProof, Voter } from "../../../Common/Domain";
import { NotificationHelper } from "../Helpers/NotificationHelper";
import { INotificationSender } from "../../../Common/NotificationSender";
import { QueryMongo } from "../../DataAccess/Query/QueryMongo";
import { CommandMongo } from "../../DataAccess/Command/CommandMongo";
import { Command } from "../../DataAccess/Command/Command";

export class VoteController {
  public static async getVote(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();
    const user: UserDTO = getUserInSession(req);
    let { electionId, voterCI } = req.body;
    if (!(electionId && voterCI)) {
      logger.logBadRequest(
        "electionId or voterCI not provided",
        req.originalUrl,
        user
      );
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
      logger.logBadRequest(
        `election ${electionId} does not exist`,
        req.originalUrl
      );
      res.status(404).send("Election " + electionId + " does not exist");
    }
  }

  public static async getVoteProof(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();

    let { voterCI, voteId } = req.body;

    if (!(voteId && voterCI)) {
      logger.logBadRequest("voteId or voterCI not provided", req.originalUrl);
      res.status(400).send("voteId or voterCI not provided");
      return;
    }

    let command = Command.getCommand();
    let query = Query.getQuery();
    let notificationSender: NotificationHelper =  NotificationHelper.getNotificationHelper();

    try {
      let vote = await query.getVote(voteId, voterCI);

      if (!vote) {
        logger.logBadRequest("vote not found", req.originalUrl);
        res.status(404).send("vote not found");
        return;
      }

      let voter: Voter = await query.getVoter(voterCI);
      let election : ElectionInfo= await query.getElection(vote.electionId);
      if (!voter || !election) {
        logger.logBadRequest("voter or election not found", req.originalUrl);
        res.status(404).send("voter or election not found");
        return;
      }


      let voteProofRequestCount : number = await query.getVoteProofLogCount(voterCI, election.id);
      let maxRequestsAllowed : number = election.maxVoteRecordRequestsPerVoter;
      
      if (voteProofRequestCount >= maxRequestsAllowed) {
        command.AddVoteProofLog(voterCI, new Date(), election.id , true)
        let errorMessage = `voter ${voterCI} already requested the maximum amount of voter proofs for election ${election.id}`;
        notificationSender.alertSender.sendNotification(errorMessage, election.emails);
        logger.logBadRequest(errorMessage, req.originalUrl);
        res.status(400).send(errorMessage);
        return;
      }

      let voteProof: VoteProof = new VoteProof(vote, voter, election);
      let sender: INotificationSender = notificationSender.voteProofSender;
      sender.sendNotification(voteProof.ToString(), [voter.email]);
      command.AddVoteProofLog(voterCI, new Date(), election.id , false)
      res.status(200).send(`Vote Proof sent to email`);

    } catch (err) {
      logger.logBadRequest("vote not found", req.originalUrl);
      res.status(404).send("vote not found");
    }
  }
}
