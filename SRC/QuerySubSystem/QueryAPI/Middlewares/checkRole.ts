import { Request, Response, NextFunction } from "express";
import {UserRepository} from "../../DataAccess/UserRepository";
import { IUser } from "../Models/IUser";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Get the user ID from previous midleware
    const email = res.locals.jwtPayload.email;

    //Get user role from the database
    let user: IUser;
    try {
      user = await UserRepository.findByEmailOrFail(email);
      console.log(user);
      (roles.indexOf(user.role) > -1)? next(): res.status(401).send("User not authorized"); //check if role is in array
    } catch (id) {
      res.status(401).send("User not found role");
    }

  };
};