import { Request, Response, NextFunction } from "express";
import { UserDTO } from "../Models/User";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { validateToken } from "../../DataAccess/Auth/client";
import config from "config";
const isTesting = config.get("testing");

export async function checkJWTAndRole(req: Request, res: Response, next: NextFunction, roles: Array<string>) {
  if(isTesting){
    next();
    return;
  }

  const logger = LoggerFacade.getLogger();
  try {
    const token = <string>req.headers["auth"];
    let user: UserDTO = await validateToken(token);
    if (roles.indexOf(user.role) > -1) {
      logger.logAuthorizedAccess(
        "User authorized to access.  Authorized roles: " + roles.join(", "),
        req.originalUrl,
        user
      );
      res.locals.userDTO = user;
      next();
    } else {
      logger.logUnauthorizedAccess(
        "User not authorized.  Authorized roles: " + roles.join(", "),
        req.originalUrl,
        user
      );
      res.status(403).send("User not authorized. Authorized roles: " + roles.join(", "));
    }
  } catch (id) {
    logger.logUnauthorizedAccess("User not found ", req.originalUrl);

    res.status(401).send("Invalid user auth token");
  }
};
