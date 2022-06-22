import { Router } from "express";
import { ElectionController } from "../Controllers/ElectionController";
import { checkJWTAndRole } from "../Middlewares/CheckJWTAndRole";
import {Roles} from "../../../Common/Domain";
import { responseWrapper } from "../Middlewares/ResponseWrapper";
const router = Router({ mergeParams: true });

let allRoles = [Roles.Consultant, Roles.Voter, Roles.ElectoralAuthority, Roles.QueryAgent]

router.get("/config",[checkJWTAndRole([Roles.Consultant, Roles.ElectoralAuthority])],ElectionController.getConfig, [responseWrapper()]);
router.post("/config", [checkJWTAndRole([Roles.Consultant])], ElectionController.setSettings);
router.get("/vote-frequency", [checkJWTAndRole(allRoles)], ElectionController.getVoteFrequency, [responseWrapper()]);
router.get("/circuit-info",  [checkJWTAndRole(allRoles)], ElectionController.getCircuitInfo, [responseWrapper()]);
router.get("/state-info", [checkJWTAndRole(allRoles)], ElectionController.getStateInfo, [responseWrapper()]);
router.get("/",  [checkJWTAndRole([Roles.ElectoralAuthority])], ElectionController.getElectionInfo, [responseWrapper()]);

export default router;
