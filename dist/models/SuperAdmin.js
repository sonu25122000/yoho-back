"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.SuperAdminSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    coin: { type: Number, default: 0 },
    pin: { type: Number, required: false, default: null },
}, { timestamps: true });
const SuperAdminModel = mongoose_1.default.model("SuperAdmin", exports.SuperAdminSchema);
exports.default = SuperAdminModel;
