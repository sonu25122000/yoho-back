import express from "express";
import { reCruiterController } from "../controllers/recruiter";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateChangePassword,
  validateRecruiterDetails,
} from "../utils/recruiter";

const router = express.Router();
router.get("/", authenticateToken, reCruiterController.getAllRecruiter);
router.post("/sellRecharge", reCruiterController.sellRecharge);

router.get("/:id", reCruiterController.getRecruiterById);

router.post(
  "/register",
  validateRecruiterDetails,
  authenticateToken,
  reCruiterController.register
);

router.post(
  "/login",
  // authenticateToken,
  // authenticateToken,
  reCruiterController.login
);
router.patch(
  "/change-recruiter-password",
  reCruiterController.changePasswordForUser
);
router.patch("/:id", authenticateToken, reCruiterController.updateRecruiter);
router.patch(
  "/change-password/:id",
  validateChangePassword,
  authenticateToken,
  reCruiterController.changePassword
);

router.put(
  "/deactivate/:id",
  authenticateToken,
  reCruiterController.deactivatedRecruiter
);
router.delete(
  "/delete/:id",
  authenticateToken,
  reCruiterController.softDeletedRecruiter
);
router.patch("/recharge/:id", reCruiterController.recharge);
router.patch("/withdrawCommission/:id", reCruiterController.withDrawCommission);
export default router;
