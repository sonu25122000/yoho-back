"use strict";
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
exports.superAdminController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SuperAdmin_1 = __importDefault(require("../models/SuperAdmin"));
const handleMongoError_1 = require("../utils/handleMongoError");
const jwtSecret_1 = require("../service/jwtSecret");
const jwtService_1 = require("../service/jwtService");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle superAdmin registration
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    try {
        // Check if superAdmin already existss
        const existingSuperAdmin = yield SuperAdmin_1.default.findOne({ phoneNumber });
        if (existingSuperAdmin) {
            return res.status(400).json({
                success: false,
                message: `SuperAdmin already exists with ${phoneNumber}`,
            });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, jwtSecret_1.JWT_SALT);
        // Create new superAdmin
        const newSuperAdmin = new SuperAdmin_1.default({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
        });
        yield newSuperAdmin.save();
        return res
            .status(201)
            .json({ success: true, message: "SuperAdmin registered successfully" });
    }
    catch (error) {
        console.error("Error in SuperAdmin registration:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Handle SuperAdmin login
    const { phoneNumber, password } = req.body;
    try {
        // Find SuperAdmin by email
        const SuperAdmin = yield SuperAdmin_1.default.findOne({ phoneNumber });
        if (!SuperAdmin) {
            return res.status(404).json({
                success: false,
                message: `Phone Number ${phoneNumber} is not registered.`,
            });
        }
        // Verify password
        if (!(yield bcryptjs_1.default.compare(password, SuperAdmin.password))) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }
        const token = (0, jwtService_1.generateToken)(SuperAdmin._id, jwtSecret_1.JWT_SECRET);
        // Return JWT token or other authentication response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            data: SuperAdmin,
        });
    }
    catch (error) {
        console.error("Error in user login:", error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const rechargeCoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Provided ID is not valid",
            });
        }
        const { coin } = req.body;
        const superAdmin = yield SuperAdmin_1.default.findById(id);
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: "SuperAdmin not found",
            });
        }
        yield SuperAdmin_1.default.findByIdAndUpdate(id, { coin: superAdmin.coin + coin }, { new: true });
        return res.status(200).json({
            success: false,
            message: "Recharge Successfull.",
        });
    }
    catch (error) {
        console.log(error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const getSuperAdminById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Provided ID is not valid",
            });
        }
        const superAdmin = yield SuperAdmin_1.default.findById(id);
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: "SuperAdmin Not Found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "SuperAdmin Details",
            data: superAdmin,
        });
    }
    catch (error) {
        console.log(error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
const getAllSuperAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const superAdmin = yield SuperAdmin_1.default.find();
        return res.status(200).json({
            success: true,
            message: "SuperAdmin Details",
            data: superAdmin,
        });
    }
    catch (error) {
        console.log(error);
        (0, handleMongoError_1.handleMongoError)(error, res);
    }
});
exports.superAdminController = {
    register,
    login,
    rechargeCoin,
    getSuperAdminById,
    getAllSuperAdmin,
};
