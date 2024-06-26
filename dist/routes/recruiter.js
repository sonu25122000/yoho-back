"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recruiter_1 = require("../controllers/recruiter");
const auth_middleware_1 = require("../middleware/auth.middleware");
const recruiter_2 = require("../utils/recruiter");
const router = express_1.default.Router();
router.get("/", auth_middleware_1.authenticateToken, recruiter_1.reCruiterController.getAllRecruiter);
router.post("/sellRecharge", recruiter_1.reCruiterController.sellRecharge);
router.get("/:id", recruiter_1.reCruiterController.getRecruiterById);
router.post("/register", recruiter_2.validateRecruiterDetails, auth_middleware_1.authenticateToken, recruiter_1.reCruiterController.register);
router.post("/login", 
// authenticateToken,
// authenticateToken,
recruiter_1.reCruiterController.login);
router.patch("/change-recruiter-password", recruiter_1.reCruiterController.changePasswordForUser);
router.patch("/:id", auth_middleware_1.authenticateToken, recruiter_1.reCruiterController.updateRecruiter);
router.patch("/change-password/:id", recruiter_2.validateChangePassword, auth_middleware_1.authenticateToken, recruiter_1.reCruiterController.changePassword);
router.put("/deactivate/:id", auth_middleware_1.authenticateToken, recruiter_1.reCruiterController.deactivatedRecruiter);
router.delete("/delete/:id", auth_middleware_1.authenticateToken, recruiter_1.reCruiterController.softDeletedRecruiter);
router.patch("/recharge/:id", recruiter_1.reCruiterController.recharge);
router.patch("/withdrawCommission/:id", recruiter_1.reCruiterController.withDrawCommission);
exports.default = router;
