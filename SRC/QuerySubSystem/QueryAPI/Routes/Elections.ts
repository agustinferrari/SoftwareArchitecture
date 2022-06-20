import { Router } from "express";
import { ElectionController } from "../Controllers/ElectionController";
import { checkJWTAndRole } from "../Middlewares/CheckJWTAndRole";
import {Roles} from "../../../Common/Domain";
const router = Router({ mergeParams: true });
router.get(
  "/config",
  [checkJWTAndRole([Roles.Consultant, Roles.ElectoralAuthority])],
  ElectionController.getConfig
);
router.post("/config", [checkJWTAndRole([Roles.Consultant])], ElectionController.setSettings);
router.get("/vote-frequency", [checkJWTAndRole([Roles.Consultant, Roles.Voter, Roles.ElectoralAuthority, Roles.QueryAgent])], ElectionController.getVoteFrequency);
router.get("/circuit-info",  [checkJWTAndRole([Roles.Consultant, Roles.Voter, Roles.ElectoralAuthority, Roles.QueryAgent])], ElectionController.getCircuitInfo);
router.get("/state-info", [checkJWTAndRole([Roles.Consultant, Roles.Voter, Roles.ElectoralAuthority, Roles.QueryAgent])], ElectionController.getStateInfo);
router.get("/",  [checkJWTAndRole([Roles.ElectoralAuthority])], ElectionController.getElectionInfo);

export default router;
