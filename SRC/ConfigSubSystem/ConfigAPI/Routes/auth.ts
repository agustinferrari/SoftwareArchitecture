import { Router } from "express";
import AuthController from "../Controllers/AuthController";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";

const router = Router();
//Login route
router.post("/login", AuthController.login);
router.post("/config", [checkJwt, checkRole(["Consultant"])],AuthController.authority);


export default router;