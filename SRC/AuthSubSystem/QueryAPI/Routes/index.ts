import { Router } from "express";
import auth from "./Auth";

const routes = Router({ mergeParams: true });

routes.use("/auth", auth);

export default routes;
