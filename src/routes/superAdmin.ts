import express from "express";
import { superAdminController } from "../controllers/superAdmin";
import { validateRecharge } from "../utils/superadmin";
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", superAdminController.register);
router.post("/login", superAdminController.login);
router.patch(
  "/change-password",
  authenticateToken,
  superAdminController.changePassword
);
router.patch(
  "/recharge/:id",
  validateRecharge,
  authenticateToken,
  superAdminController.rechargeCoin
);
router.get("/", superAdminController.getAllSuperAdmin);
router.get("/:id", superAdminController.getSuperAdminById);
export default router;
