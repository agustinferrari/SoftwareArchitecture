import { Router } from "express";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";
import { ConfigController } from "../Controllers/ConfigController";

const router = Router();
//Login route
router.post("/notifications", checkJwt, checkRole(["Consultant"]), ConfigController.updateNotificationSettings);

export default router;