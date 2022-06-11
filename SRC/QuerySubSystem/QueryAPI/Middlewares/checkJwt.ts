import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "config";
import { LoggerFacade } from "../../Logger/LoggerFacade";


export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  let jwtPayload;
  
  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.get("QUERY_API.jwtSecret"));
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    LoggerFacade.getLogger().logUnauthorizedAccess("Token not valid", req.originalUrl);
    res.status(401).send("Token is not valid");
    return;
  }
  next();
};