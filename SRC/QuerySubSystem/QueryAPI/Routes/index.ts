import { Router } from "express";
import votes from "./votes";
import elections from "./elections";

const routes = Router({ mergeParams: true });

routes.use("/votes", votes);
routes.use("/elections/:id", elections);

export default routes;
