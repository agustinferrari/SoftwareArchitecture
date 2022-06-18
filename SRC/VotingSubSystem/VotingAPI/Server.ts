import { Application, Request, Response, NextFunction } from "express";
import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VotingService } from "./VotingService";
const express = require("express");
import config from "config";
import { TimeoutError } from "./Error/TimeOutError";
import { checkJWTAndRole } from "./Middlewares/checkJWTAndRole";
import { LoggerFacade } from "../Logger/LoggerFacade";
import { RequestStatus } from "./Models/RequestStatus";
import { scheduleJob, RecurrenceRule } from "node-schedule";
import { RequestCountHelper } from "../RequestCountHelper";

class Server {
  public app: Application;
  private service: VotingService;
  private logger: LoggerFacade;
  private reqCountHelper: RequestCountHelper;

  constructor(votingService: VotingService) {
    this.app = express();
    this.service = votingService;
    this.config();
    this.routes();
    this.logger = LoggerFacade.getLogger();
    this.reqCountHelper = RequestCountHelper.getInstance();
    let rule = new RecurrenceRule();
    rule.second = 0;
    scheduleJob(rule, async () => {
      console.log(this.reqCountHelper);
    });
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port: " + this.app.get("port"));
    });
  }

  private config(): void {
    this.app.set("port", config.get("VOTING_API.port") || 3002);
    this.app.use(express.json());
  }

  private routes(): void {
    this.app.post(
      "/votes",
      /*checkJWTAndRole(["Voter"]),*/ async (req: Request, res: Response, next: NextFunction) => {
        let startResponse = new Date();
        let ci = req.body.ci;
        req.setTimeout(0);
        this.reqCountHelper.expressCount++;
        let endResponse = new Date();
        let responseTime = endResponse.valueOf() - startResponse.valueOf();
        let timeout: number = config.get("VOTING_API.timeout");
        if (responseTime > timeout) {
          let message = `Timeout on vote for ci ${ci}`;
          this.logger.logServerError(message, "/votes");
          res.status(500).send(message);
        } else {
          res.status(200).send("Voto procesado");
          next();
        }
      },
      async (req: Request) => {
        req.setTimeout(0);
        this.reqCountHelper.nextFunction++;
        try {
          let converted = req.body;

          let voteIntent: VoteIntentEncrypted = converted as VoteIntentEncrypted;
          await this.service.handleVote(voteIntent);
        } catch (e: any) {
          this.reqCountHelper.errorCount++;
          this.reqCountHelper.errorType.push(e.message);
          if (e instanceof TimeoutError) {
          } else {
            this.logger.logBadRequest(
              `Voting issue for ci ${req.body.voterCI}: ${e.message}`,
              req.originalUrl
            );
          }
        }
      }
    );
  }
}

export default Server;
