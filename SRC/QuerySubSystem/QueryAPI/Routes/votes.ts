import { Router } from "express";
import { VoteController } from "../Controllers/VoteController";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";

const router = Router({ mergeParams: true });
router.get("", [checkJwt, checkRole(["Electoral Authority"])], VoteController.getVote);
router.get("/proof", VoteController.getVoteProof);

export default router;
