import { Router } from "express";
import auth from "./auth";

const routes = Router({ mergeParams: true });

routes.use("/auth", auth);

export default routes;
