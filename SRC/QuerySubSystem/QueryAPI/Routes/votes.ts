import { Router } from "express";
import { VoteController } from "../Controllers/VoteController";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";

const router = Router();
router.get("", [checkJwt, checkRole(["Electoral Authority"])], VoteController.getVote);

export default router;
