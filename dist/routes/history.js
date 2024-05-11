"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const history_1 = require("../controllers/history");
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.get("/", history_1.historyController.getHistory);
router.get("/today-sell", auth_middleware_1.authenticateToken, history_1.historyController.getTodaysSell);
router.get("/monthly-sell", history_1.historyController.getMonthlySell);
router.patch("/approve/:id", auth_middleware_1.authenticateToken, history_1.historyController.approvRecharge);
router.patch("/reject/:id", auth_middleware_1.authenticateToken, history_1.historyController.rejectRecharge);
router.patch("/approveSellRecharge/:id", auth_middleware_1.authenticateToken, history_1.historyController.approveSellRecharge);
router.patch("/rejectSellRecharge/:id", auth_middleware_1.authenticateToken, history_1.historyController.rejectSellRecharge);
exports.default = router;
