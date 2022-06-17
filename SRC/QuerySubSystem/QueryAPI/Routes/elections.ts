import { Router } from "express";
import { ElectionController } from "../Controllers/ElectionController";
import { checkJWTAndRole } from "../Middlewares/checkJWTAndRole";

const router = Router({ mergeParams: true });
router.get(
  "/config",
  [checkJWTAndRole(["Electoral Authority", "Consultant"])],
  ElectionController.getConfig
);
router.post("/config", [checkJWTAndRole(["Consultant"])], ElectionController.setSettings);
router.get("/vote-frequency", ElectionController.getVoteFrequency);
router.get("/circuit-info", ElectionController.getCircuitInfo);
router.get("/state-info", ElectionController.getStateInfo);
router.get("/", ElectionController.getElectionInfo);

export default router;
