"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const superAdmin_1 = require("../controllers/superAdmin");
const superadmin_1 = require("../utils/superadmin");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/register", superAdmin_1.superAdminController.register);
router.post("/login", superAdmin_1.superAdminController.login);
router.patch("/recharge/:id", superadmin_1.validateRecharge, auth_middleware_1.authenticateToken, superAdmin_1.superAdminController.rechargeCoin);
router.get("/:id", superAdmin_1.superAdminController.getSuperAdminById);
exports.default = router;
