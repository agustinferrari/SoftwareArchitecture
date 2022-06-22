import { Router } from "express";
import { Roles } from "../../../Common/Domain";
import { VoteController } from "../Controllers/VoteController";
import { checkJWTAndRole } from "../Middlewares/CheckJWTAndRole";
import { responseWrapper } from "../Middlewares/ResponseWrapper";

const router = Router({ mergeParams: true });
router.get("", [checkJWTAndRole([Roles.ElectoralAuthority])], VoteController.getVote, [responseWrapper()]);
router.get("/proof",  [checkJWTAndRole([Roles.Voter])], VoteController.getVoteProof, [responseWrapper()]);

export default router;
