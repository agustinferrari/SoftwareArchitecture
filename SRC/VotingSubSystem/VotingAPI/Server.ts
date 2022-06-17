import { Application, Request, Response } from "express";
import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VotingService } from "./VotingService";
const express = require("express");
import config from "config";
import { TimeoutError } from "./Error/TimeOutError";
import { checkJWTAndRole } from "./Middlewares/checkJWTAndRole";

class Server {
  public app: Application;
  private service: VotingService;

  constructor(votingService: VotingService) {
    this.app = express();
    this.service = votingService;
    this.config();
    this.routes();
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
    this.app.post("/votes", checkJWTAndRole(["Voter"]), async (req: Request, res: Response) => {
      try {
        console.log("entra");
        let converted = req.body;

        let voteIntent: VoteIntentEncrypted = converted as VoteIntentEncrypted;
        await this.service.handleVote(voteIntent);
        res.status(200).send("Voto procesado");
      } catch (e: any) {
        if (e instanceof TimeoutError) {
          res.status(500).send(e.message);
        } else {
          res.status(400).send(e.message);
        }
      }
    });
  }
}

export default Server;
