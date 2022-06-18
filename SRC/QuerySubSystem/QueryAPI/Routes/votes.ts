import { Router } from "express";
import { Roles } from "../../../Common/Domain";
import { VoteController } from "../Controllers/VoteController";
import { checkJWTAndRole } from "../Middlewares/checkJWTAndRole";

const router = Router({ mergeParams: true });
router.get("", [checkJWTAndRole([Roles.ElectoralAuthority])], VoteController.getVote);
router.get("/proof",  [checkJWTAndRole([Roles.Voter])], VoteController.getVoteProof);

export default router;
