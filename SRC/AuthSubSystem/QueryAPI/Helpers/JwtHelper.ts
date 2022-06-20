import * as jwt from "jsonwebtoken";
import { IUser, UserDTO } from "../Models/User";
import config from "config";
import { Request } from "express";
import { Query } from "../../DataAccess/Query/Query";

export async function getUserInSession(token: string): Promise<UserDTO | null> {
  try {
    let jwtPayload = <any>jwt.verify(token, config.get("QUERY_API.jwtSecret"));
    console.log(jwtPayload);
    let user: IUser;
    let userRepo = Query.getQuery();
    try {
      user = await userRepo.findByEmailOrFail(jwtPayload.email);
      if (user.role == jwtPayload.role && user.ci == jwtPayload.ci) {
        console.log("Token is valid");
        return new UserDTO(jwtPayload.email, jwtPayload.ci, jwtPayload.role);
      } else {
        return null;
      }
    } catch (id) {
      console.log("User with email:" + jwtPayload.email + " not found");
      return null;
    }
  } catch (error) {
    console.log("Token is not valid");
    return null;
  }
}
