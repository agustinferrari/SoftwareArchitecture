import { Application, Request, Response, NextFunction } from "express";
import { VoteIntentEncrypted } from "../Models/VoteIntentEncrypted";
import { VotingService } from "../VotingService";
const express = require("express");
import config from "config";
import { VoteEncryption } from "../VoteEncryption";
import { VoteIntent } from "../Models/VoteIntent";
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
    this.app.post("/votes", (req: Request, res: Response) => {
      try {
        let converted = req.body;
        converted.startTimestamp = new Date(converted.startTimestamp);
        let voteIntent: VoteIntent = converted as VoteIntent;
        this.service.handleVote(voteIntent);
        res.status(200).send("Voto procesado");
      } catch (e: any) {
        res.status(400).send(e.message);
      }
    });
  }
}

export default Server;
