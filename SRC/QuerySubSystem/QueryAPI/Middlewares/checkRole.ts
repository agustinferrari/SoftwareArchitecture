import { Request, Response, NextFunction } from "express";
import {UserRepository} from "../../DataAccess/UserRepository";
import { IUser, UserDTO } from "../Models/User";
import { LoggerFacade } from "../../Logger/LoggerFacade";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const email = res.locals.jwtPayload.email;
    const logger = LoggerFacade.getLogger();
    //Get user role from the database
    let user: IUser;
    let userRepo = UserRepository.getUserRepository();
    try {
      user = await userRepo.findByEmailOrFail(email);
      console.log(user);
      const userDTO =  new UserDTO(user.email,user.role);
      if(roles.indexOf(user.role) > -1){
        logger.logAuthorizedAccess("User authorized to access.  Authorized roles: " + roles.join(", "), req.originalUrl, userDTO);
        next();
      }else{
        logger.logUnauthorizedAccess("User not authorized.  Authorized roles: " + roles.join(", "), req.originalUrl, userDTO);
        res.status(401).send("User not authorized. Authorized roles: " + roles.join(", "));
      }
    } catch (id) {
      logger.logUnauthorizedAccess("User not found " , req.originalUrl, new UserDTO(email));

      res.status(401).send("User with email:" + email+" not found");
    }

  };
};