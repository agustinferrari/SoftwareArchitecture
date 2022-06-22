import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { IUser, UserDTO } from "../Models/User";
import config from "config";
import { Query } from "../../DataAccess/Query/Query";

export class AuthController {
  public static async login(req: Request, res: Response) {
    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("Email or password not provided");
    }

    //Get user from database
    let user: IUser | null;
    user = null;
    let query = Query.getQuery();
    try {
      user = await query.findByEmailOrFail(email);
    } catch (error: any) {
      res.status(404).send("User not found");
    }

    if (user) {
      const userDTO = new UserDTO(user.email, user.role, user.ci);

      if (user.password != password) {
        res.status(401).send("Incorrect password");
        return;
      }

      const token = jwt.sign(
        { email: user.email, role: user.role, ci: user.ci },
        config.get("QUERY_API.jwtSecret")
      );
      res.status(200).send(token);
    }
  }
}
export default AuthController;
