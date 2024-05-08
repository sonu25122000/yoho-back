"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecruiterSchema = exports.Status = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var Status;
(function (Status) {
    Status["APPROVED"] = "approved";
    Status["PENDING"] = "pending";
    Status["RJECTED"] = "rejected";
})(Status || (exports.Status = Status = {}));
exports.RecruiterSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    active: { type: Boolean, required: false, default: true },
    isDeleted: { type: Boolean, default: false },
    coin: { type: Number, default: 0 },
    commision: { type: Number, required: true }, // will be add at the time of comission
    YohoId: { type: String, required: false },
    rechargeStatus: { type: String, enum: Object.values(Status) },
    commissionEarned: { type: Number, required: false, default: 0 },
}, { timestamps: true });
const RecruiterModel = mongoose_1.default.model("Recruiter", exports.RecruiterSchema);
exports.default = RecruiterModel;
