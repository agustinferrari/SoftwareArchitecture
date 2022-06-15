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
router.post("/config", [checkJwt, checkRole(["Consultant"])], ElectionController.setSettings);
router.get("/vote-frequency", ElectionController.getVoteFrequency);
router.get("/circuit-info", ElectionController.getCircuitInfo);
router.get("/state-info", ElectionController.getStateInfo);
router.get("/", ElectionController.getElectionInfo);

export default router;
