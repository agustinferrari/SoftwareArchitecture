import { Application, Request, Response, NextFunction } from "express";
const express = require("express");
import config from "config";
import routes from "./Routes";
const cors = require("cors");

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port: " + this.app.get("port"));
    });
  }

  private config(): void {
    this.app.set("port", config.get("QUERY_API.port") || 3003);
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use("/", routes);
  }
}

export default Server;
