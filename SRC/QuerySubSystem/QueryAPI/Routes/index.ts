import { Router, Request, Response } from "express";
import auth from "./auth";

const routes = Router();

routes.use("/auth", auth);
routes.use("/votes", auth);

export default routes;
