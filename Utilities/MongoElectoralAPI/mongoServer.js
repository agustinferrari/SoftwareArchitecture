const express = require("express");
const config = require("config");

const MongoAccess = require("../MongoUtilities/mongoAccess");

class Server {
   app;
   service;

  constructor() {
    this.app = express();
    this.MongoAccess = new MongoAccess();
    this.config();
    this.routes();
  }

   start() {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port: " + this.app.get("port"));
    });
  }

   config()  {
    this.app.set("port", config.get("API.port") || 3002);
    this.app.use(express.json());
    this.verbose = config.get("API.verbose") || false;
  }

   routes() {
    this.app.get("/elections", async (req, res) => {
      try {
        let startTimestamp = new Date();
        let found = await this.MongoAccess.getElections();
        let endTimestamp = new Date();
        let duration = this.dateDiff(endTimestamp, startTimestamp);

        if(this.verbose) {
          console.log(`[${req.url}] Found ${found.length} elections in ${duration}ms`);
        }

        res.status(200).send(found);
      } catch (e) {
        if(this.verbose) {
          console.log(`[${req.url}] Error getting voters: ${e.message}`);
        }
        res.status(400).send(e.message);
      }
    });

    this.app.get("/voters", async (req, res) => {
        try {
          let startTimestamp = new Date();


          let limit = req.query.limit;
          let page = req.query.page;
          let found = await this.MongoAccess.getVoterPaginated(page, limit);

          let endTimestamp = new Date();
          let duration = this.dateDiff(endTimestamp, startTimestamp);

          if(this.verbose) {
            console.log(`[${req.url}] Found ${found.length} voters in ${duration}ms`);
          }

          res.status(200).send(found);
        } catch (e) {
          if(this.verbose) {
            console.log(`[${req.url}] Error getting voters: ${e.message}`);
          }
          res.status(400).send(e.message);
        }
      });
  }

  dateDiff(date1, date2) {
    return date1.getTime() - date2.getTime();
  }
}

module.exports = Server;