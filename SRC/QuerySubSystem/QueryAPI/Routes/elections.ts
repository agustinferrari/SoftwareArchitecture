import { Router } from "express";
import { ElectionController } from "../Controllers/ElectionController";
import { checkJwt } from "../Middlewares/checkJwt";
import { checkRole } from "../Middlewares/checkRole";

const router = Router();
router.get(
  "/:id/config",
  [checkJwt, checkRole(["Electoral Authority", "Consultant"])],
  ElectionController.getConfig
);

export default router;
