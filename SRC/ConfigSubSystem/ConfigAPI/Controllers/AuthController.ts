import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IUser, UserDTO } from "../Models/User";
import config from "config";
import { UserRepository } from "../../DataAccess/Repositories/UserRepository";
import { LoggerFacade } from "../../Logger/LoggerFacade";

export class AuthController {

   static login = async (req: Request, res: Response) => {

    const logger = LoggerFacade.getLogger();
    let { email, password } = req.body;
    if (!(email && password)) {
      logger.logUnauthorizedAccess("Email or password not provided", req.originalUrl);
      res.status(400).send("Email or password not provided");
    }

    //Get user from database
    let user: IUser | null;
    user = null;
    let userRepo = UserRepository.getUserRepository();
    try {
      user = await userRepo.findByEmailOrFail(email);
    } catch (error:any) {
      logger.logUnauthorizedAccess("User not found", req.originalUrl, new UserDTO(email));
      res.status(404).send("User not found");
    }

    if (user){
    const userDTO = new UserDTO(user.email, user.role)

    if (user.password != password) {
      logger.logUnauthorizedAccess("Access Denied: Incorrect password", req.originalUrl,userDTO);
      res.status(401).send("Access Denied: Incorrect password");
      return;
    }

    if(user.role != "Consultant"){
      logger.logUnauthorizedAccess("Access Denied: User is not a consultant", req.originalUrl,userDTO);
      res.status(401).send("Access Denied: User is not a consultant");
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      {email: user.email, role: user.role},
      config.get("QUERY_API.jwtSecret"),
      { expiresIn: "1h" }
    );
    logger.logAuthorizedAccess("User logged in | Token: "+ token,req.originalUrl, userDTO);
    res.status(200).send(token);
  
}

  };

  static authority = async (req: Request, res: Response) => {
    const logger = LoggerFacade.getLogger();
    res.status(200);
    logger.logAuthorizedAccess("Access granted ", req.path, new UserDTO(req.body.email,req.body.role));
    res.send("Bienvenido");

  }

}
export default AuthController;