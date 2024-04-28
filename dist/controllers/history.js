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
exports.historyController = void 0;
const handleMongoError_1 = require("../utils/handleMongoError");
const History_1 = __importStar(require("../models/History"));
const mongoose_1 = __importStar(require("mongoose"));
const SuperAdmin_1 = __importDefault(require("../models/SuperAdmin"));
const Recruiter_1 = __importDefault(require("../models/Recruiter"));
const getHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.query;
    try {
        let query = {};
        if (status) {
            if (status === "pending") {
                query.status = "pending"; // If status is 'pending', filter only pending records
            }
            else {
                query.status = { $ne: "pending" }; // If status is other than 'pending', filter records other than pending
            }
        }
        const history = yield History_1.default.find(query).populate({
            path: "recruiterID",
        });
        return res.status(200).json({
            success: true,
            message: "History List.",
            data: history,
        });
    }
    catch (error) {
        console.log("Error while fetching the history List.");
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const approvRecharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // history id
        const { id } = req.params;
        const { adminID, coin, recruiterID } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(recruiterID) || !(0, mongoose_1.isValidObjectId)(adminID)) {
            return res.status(400).json({
                success: false,
                message: "Either admin id or recruiter id not valid.",
            });
        }
        const history = yield History_1.default.findById(id).session(session);
        if (!history) {
            return res
                .status(404)
                .json({ success: false, error: "history not found" });
        }
        // Fetch the admin from the database
        const admin = yield SuperAdmin_1.default.findById(adminID).session(session);
        if (!admin) {
            return res.status(404).json({ success: false, error: "Admin not found" });
        }
        // Fetch the user from the database
        const recruiter = yield Recruiter_1.default.findById(recruiterID).session(session);
        if (!recruiter) {
            return res
                .status(404)
                .json({ success: false, error: "recruiter not found" });
        }
        // Update admin's coin balance
        admin.coin -= coin;
        // Validate admin's updated coin balance
        if (admin.coin < 0) {
            yield session.abortTransaction();
            session.endSession();
            return res
                .status(400)
                .json({ success: false, error: "Insufficient coins in admin account" });
        }
        // Update user's coin balance
        recruiter.coin += coin;
        history.status = History_1.Status.APPROVED;
        // Save changes to admin and user
        yield admin.save();
        yield recruiter.save();
        yield history.save();
        yield session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            success: true,
            message: "Recharged Requested Approved",
        });
    }
    catch (error) {
        console.error("Error in rechargeUser controller:", error);
        yield session.abortTransaction();
        session.endSession();
        return res
            .status(500)
            .json({ success: false, error: "Internal server error" });
    }
});
const rejectRecharge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // history id
        const { id } = req.params;
        const { recruiterID } = req.body;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({
                success: false,
                message: "history id not valid.",
            });
        }
        const history = yield History_1.default.findById(id);
        if (!history) {
            return res
                .status(404)
                .json({ success: false, error: "history not found" });
        }
        // Fetch the user from the database
        const recruiter = yield Recruiter_1.default.findById(recruiterID);
        if (!recruiter) {
            return res
                .status(404)
                .json({ success: false, error: "recruiter not found" });
        }
        history.status = History_1.Status.RJECTED;
        recruiter.rechargeStatus = History_1.Status.RJECTED;
        // Save changes to admin and user
        yield recruiter.save();
        yield history.save();
        return res.status(200).json({
            success: true,
            message: "Recharged Requested Rejected",
        });
    }
    catch (error) {
        console.error("Error in rechargeUser controller:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
exports.historyController = {
    getHistory,
    approvRecharge,
    rejectRecharge,
};
