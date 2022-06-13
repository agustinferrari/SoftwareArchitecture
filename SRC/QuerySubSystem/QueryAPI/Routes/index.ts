import { Router } from "express";
import auth from "./auth";
import votes from "./votes";
import elections from "./elections";

const routes = Router();

routes.use("/auth", auth);
routes.use("/votes", votes);
routes.use("/elections", elections);

export default routes;
