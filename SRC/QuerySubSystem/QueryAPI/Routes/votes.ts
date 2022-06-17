import { Router } from "express";
import { VoteController } from "../Controllers/VoteController";
import { checkJWTAndRole } from "../Middlewares/checkJWTAndRole";

const router = Router({ mergeParams: true });
router.get("", [checkJWTAndRole(["Electoral Authority"])], VoteController.getVote);
router.get("/proof", VoteController.getVoteProof);

export default router;
