import * as jwt from "jsonwebtoken";
import { UserDTO } from "../Models/User";
import config from "config";
import { Request } from "express";

export function getUserInSession(req: Request) {
  const token = <string>req.headers["auth"];

  let jwtPayload = <any>jwt.verify(token, config.get("QUERY_API.jwtSecret"));
  return new UserDTO(jwtPayload.email, jwtPayload.role);
}
