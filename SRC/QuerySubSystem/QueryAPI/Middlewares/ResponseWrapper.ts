import { Request, Response, NextFunction } from "express";
import { UserDTO } from "../Models/User";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { validateToken } from "../../DataAccess/Auth/Client";
import config from "config";
import { TimeStampHelper } from "../Helpers/TimeStampHelper";

var isTesting: any;
if (isTesting == undefined) {
  isTesting = config.get("testing");
}

export const responseWrapper = () => {
  return async (req: Request, res: Response) => {
    let timeStampHelper: TimeStampHelper = new TimeStampHelper(
      res.locals.timeStampHelper
    );

    let queryResult: any = timeStampHelper.queryResult;
    let code: number = timeStampHelper.code;

    let requestTimeStamp: Date = timeStampHelper.requestTimeStamp;
    let responseTimeStamp: Date = timeStampHelper.responseTimeStamp;
    let processingTime: number = timeStampHelper.processingTime;

    let result = {
      queryResult,
      requestTimeStamp: requestTimeStamp.toISOString() ,
      responseTimeStamp: responseTimeStamp.toISOString(),
      processingTime,
    };

    res.status(code).send(result);
  };
};
