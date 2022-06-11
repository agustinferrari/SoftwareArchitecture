import { Router, Request, Response } from "express";
import auth from "./auth";
import config from "./config";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";

const routes = Router();

routes.use("/auth", auth);
routes.use("/config", [checkJwt, checkRole(["Consultant"])], config);

export default routes;