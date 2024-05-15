"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reCruiterController = void 0;
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwtSecret_1 = require("../service/jwtSecret");
const handleMongoError_1 = require("../utils/handleMongoError");
const mongoose_1 = require("mongoose");
const History_1 = __importStar(require("../models/History"));
const coinJson_1 = require("../utils/coinJson");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle Recruiter registration
    const { firstName, lastName, email, password, phoneNumber, commision } = req.body;
    try {
        // Check if Recruiter already exists
        const existingRecruiter = yield Recruiter_1.default.findOne({ phoneNumber });
        if (existingRecruiter) {
            return res.status(400).json({
                success: false,
                message: "Recruiter already exists with the same phoneNumber.",
            });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, jwtSecret_1.JWT_SALT);
        // Create new Recruiter
        const newRecruiter = new Recruiter_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            commision,
        });
        yield newRecruiter.save();
        return res
            .status(201)
            .json({ success: true, message: "Recruiter registered successfully" });
    }
    catch (error) {
        console.error("Error in Recruiter registration:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle Recruiter login
    const { phoneNumber, password } = req.body;
    try {
        // Find Recruiter by email
        const Recruiter = yield Recruiter_1.default.findOne({ phoneNumber });
        if (!Recruiter) {
            return res.status(404).json({
                success: false,
                message: `Recruiter not found with ${phoneNumber}`,
            });
        }
        if (Recruiter.isDeactivated) {
            return res.status(403).json({
                success: false,
                message: "Recruiter Is Deactivated, Please contact your Admin.",
            });
        }
        // Verify password
        if (!(yield bcryptjs_1.default.compare(password, Recruiter.password))) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }
        return res
            .status(200)
            .json({ success: true, message: "Login successful", data: Recruiter });
    }
    catch (error) {
        console.error("Error in user login:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const updateRecruiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: `Provided ID : ${id} is not valid.`,
            });
        }
        const Recruiter = yield Recruiter_1.default.findById(id);
        if (!Recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter Not Found.",
            });
        }
        const updateRecruiterDetails = yield Recruiter_1.default.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({
            success: true,
            message: "Updated Successfully.",
            data: updateRecruiterDetails,
        });
    }
    catch (error) {
        console.error("Error in updaing recruiter details:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const softDeletedRecruiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: `Provided ID : ${id} is not valid.`,
            });
        }
        const Recruiter = yield Recruiter_1.default.findById(id);
        if (!Recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter Not Found.",
            });
        }
        yield Recruiter_1.default.findByIdAndUpdate(id, {
            isDeleted: true,
        });
        return res.status(200).json({
            success: true,
            message: "Recruiter Deleted SuccessFully.",
        });
    }
    catch (error) {
        console.error("Error in Deleting recruiter:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const deactivatedRecruiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: `Provided ID : ${id} is not valid.`,
            });
        }
        const Recruiter = yield Recruiter_1.default.findById(id);
        if (!Recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter Not Found.",
            });
        }
        yield Recruiter_1.default.findByIdAndUpdate(id, {
            isDeleted: true,
        });
        return res.status(200).json({
            success: true,
            message: "Recruiter Deleted SuccessFully.",
        });
    }
    catch (error) {
        console.error("Error in Deleting recruiter:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: `Provided ID : ${id} is not valid.`,
            });
        }
        const Recruiter = yield Recruiter_1.default.findById(id);
        if (!Recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter Not Found.",
            });
        }
        const { newPassword } = req.body;
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, jwtSecret_1.JWT_SALT);
        yield Recruiter_1.default.findByIdAndUpdate(id, {
            password: hashedPassword,
        }, { new: true });
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const getAllRecruiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Recruiter_1.default.find({ isDeleted: false }).select("-password");
        return res.status(200).json({
            success: true,
            message: "list of all recruiter.",
            data: data,
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const getRecruiterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: `Provided ID : ${id} is not valid`,
            });
        }
        const Recruiter = yield Recruiter_1.default.findById(id).select("-password");
        if (!Recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Recruiter details fetch Successfully.",
            data: Recruiter,
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const recharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // recruiter id
        const { id } = req.params;
        const { adminID, coin, phoneNumber } = req.body;
        const amount = coinJson_1.CoinValue * coin;
        const recruiter = yield Recruiter_1.default.findById(id);
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found.",
            });
        }
        const addHistory = new History_1.default({
            recruiterID: recruiter._id,
            purchaseType: History_1.PurchaseType.BUY,
            status: History_1.Status.PENDING,
            coin: coin,
            phoneNumber,
            amount: amount.toFixed(2),
            adminID: adminID,
        });
        recruiter.rechargeStatus = History_1.Status.PENDING;
        yield addHistory.save();
        yield recruiter.save();
        return res.status(200).json({
            success: true,
            message: "Recharge Requested.",
        });
    }
    catch (error) {
        console.error("Error in rechargeUser controller:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const sellRecharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // recruiter id
        const { YohoId, coin, id, note, amount } = req.body;
        const recruiter = yield Recruiter_1.default.findById(id);
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found.",
            });
        }
        if (recruiter.coin < 0 || recruiter.coin < coin) {
            return res.status(400).json({
                success: false,
                message: "Insufficient coins in Recruiter account",
            });
        }
        const addHistory = new History_1.default({
            recruiterID: recruiter._id,
            purchaseType: History_1.PurchaseType.SELL,
            status: History_1.Status.PENDING,
            coin: coin,
            YohoId,
            note,
            amount,
        });
        recruiter.rechargeStatus = History_1.Status.PENDING;
        yield addHistory.save();
        yield recruiter.save();
        return res.status(200).json({
            success: true,
            message: "Recharge sell successfully, wait for approval",
        });
    }
    catch (error) {
        console.error("Error in rechargeUser controller:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const withDrawCommission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amountToWithDraw, upiId } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: "Provided Id is not valid.",
            });
        }
        const recruiter = yield Recruiter_1.default.findById(id);
        if (!recruiter) {
            return res.status(404).json({
                success: false,
                message: "Recruiter Not Found.",
            });
        }
        const history = new History_1.default({
            coin: amountToWithDraw,
            purchaseType: History_1.PurchaseType.WITHDRAW,
            status: History_1.Status.PENDING,
            recruiterID: recruiter._id,
            amount: (coinJson_1.CoinValue * +amountToWithDraw).toFixed(2),
            upiId,
        });
        if (amountToWithDraw > recruiter.unlockCommission) {
            return res.status(400).json({
                success: false,
                message: "Insufficient amount to withDraw.only unlockCommission you can withdraw.",
            });
        }
        yield recruiter.save();
        yield history.save();
        return res.status(200).json({
            success: true,
            message: "Commission WithDraw Successfully.",
            data: recruiter,
        });
    }
    catch (error) {
        console.log("Error while withdraw the commsion", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const changePasswordForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { oldPassword, newPassword, id } = req.body;
        // Find user by email
        const user = yield Recruiter_1.default.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Recruiter not found",
            });
        }
        // Verify current password
        const passwordMatch = yield bcryptjs_1.default.compare(oldPassword, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Old Password",
            });
        }
        // Hash the new password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        // Update user's password in the database
        user.password = hashedPassword;
        yield user.save();
        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
exports.reCruiterController = {
    register,
    login,
    updateRecruiter,
    softDeletedRecruiter,
    getAllRecruiter,
    getRecruiterById,
    changePassword,
    deactivatedRecruiter,
    recharge,
    sellRecharge,
    withDrawCommission,
    changePasswordForUser,
};
