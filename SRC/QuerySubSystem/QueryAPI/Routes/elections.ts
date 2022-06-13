import { Router } from "express";
import { ElectionController } from "../Controllers/ElectionController";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";

const router = Router({ mergeParams: true });
router.get(
  "/config",
  [checkJwt, checkRole(["Electoral Authority", "Consultant"])],
  ElectionController.getConfig
);
router.get("/vote-frequency", ElectionController.getVoteFrequency);

export default router;
