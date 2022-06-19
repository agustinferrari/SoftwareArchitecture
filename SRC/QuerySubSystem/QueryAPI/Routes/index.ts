import { Router } from "express";
import votes from "./Votes";
import elections from "./Elections";

const routes = Router({ mergeParams: true });

routes.use("/votes", votes);
routes.use("/elections/:id", elections);

export default routes;
