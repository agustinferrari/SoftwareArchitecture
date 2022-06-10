import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IUser } from "../Models/IUser";
import config from "config";
import { UserRepository } from "../../DataAccess/UserRepository";

export class AuthController {

   static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }

    //Get user from database
    let user: IUser | null;
    user = null;
    try {
      user = await UserRepository.findByEmailOrFail(email);
    } catch (error:any) {
      res.status(401).send(error.message);
    }

    if (user && user.password != password) {
      res.status(401).send();
      return;
    }

    //Sing JWT, valid for 1 hour
    if(user){
    const token = jwt.sign(
      { email: user.email, role: user.role },
      config.get("QUERY_API.jwtSecret"),
      { expiresIn: "1h" }
    );
    res.send(token);
  }

  };

  static authority = async (req: Request, res: Response) => {
    res.status(200);
    res.send("Bienvenido");

  }

}
export default AuthController;