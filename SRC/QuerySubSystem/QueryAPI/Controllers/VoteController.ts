import { Request, Response } from "express";
import { getUserInSession } from "../Helpers/jwtHelper";
import { UserDTO } from "../Models/User";
import { Query } from "../../DataAccess/Query/Query";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { VoteProof } from "../../../Common/Domain";
import { NotificationHelper } from "../Helpers/NotificationHelper";
import { INotificationSender } from "../../../Common/NotificationSender";

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
    let result = await query.getVotes(electionId, voterCI);
    res.status(200).send(result);
  }

  public static async getVoteProof(req: Request, res: Response) {
    const logger = LoggerFacade.getLogger();

    let { voterCI } = req.body;
    let voteId = req.params.id;

    if (!(voteId && voterCI)) {
      logger.logBadRequest("voteId or voterCI not provided", req.originalUrl);
      res.status(400).send("voteId or voterCI not provided");
    }

    let query = Query.getQuery();
    let vote = await query.getVote(voteId, voterCI);

    if (!vote) {
      logger.logBadRequest("vote not found", req.originalUrl);
      res.status(404).send("vote not found");
      return;
    }

    let voter = await query.getVoter(voterCI);

    let election = await query.getElection(vote.electionId);

    if (!voter || !election) {
      logger.logBadRequest("voter or election not found", req.originalUrl);
      res.status(404).send("voter or election not found");
      return;
    }

    let voteProof: VoteProof = new VoteProof(vote, voter, election);
    let message = voteProof.ToString();

    let notificationSender: NotificationHelper =
      NotificationHelper.getNotificationHelper();

    let sender: INotificationSender = notificationSender.notificationSender;
    sender.sendNotification(message,[voter.email]);

    res.status(200).send(`Vote Proof sent to email`);
  }
}
