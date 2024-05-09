import { historyController } from "../controllers/history";
import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/", historyController.getHistory);
router.patch(
  "/approve/:id",
  authenticateToken,
  historyController.approvRecharge
);
router.patch(
  "/reject/:id",
  authenticateToken,
  historyController.rejectRecharge
);
router.patch("/approveSellRecharge/:id",authenticateToken,historyController.approveSellRecharge)
router.patch("/rejectSellRecharge/:id",authenticateToken,historyController.rejectSellRecharge)

export default router;
