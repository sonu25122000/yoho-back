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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorySchema = exports.Status = exports.PurchaseType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var PurchaseType;
(function (PurchaseType) {
    PurchaseType["SELL"] = "sell";
    PurchaseType["BUY"] = "buy";
    PurchaseType["WITHDRAW"] = "withdraw";
})(PurchaseType || (exports.PurchaseType = PurchaseType = {}));
var Status;
(function (Status) {
    Status["APPROVED"] = "approved";
    Status["PENDING"] = "pending";
    Status["RJECTED"] = "rejected";
})(Status || (exports.Status = Status = {}));
exports.HistorySchema = new mongoose_1.default.Schema({
    recruiterID: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "Recruiter",
    },
    fullName: { type: String },
    adminID: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: false,
        ref: "SuperAdmin",
    },
    purchaseType: {
        type: String,
        enum: Object.values(PurchaseType),
    },
    coin: { type: Number, required: false },
    status: {
        type: String,
        enum: Object.values(Status),
    },
    note: { type: String, required: false },
    YohoId: { type: String },
    amount: { type: Number, required: false },
    phoneNumber: { type: Number, required: false },
    upiId: { type: String, required: false },
}, { timestamps: true, versionKey: false });
const HistoryModel = mongoose_1.default.model("History", exports.HistorySchema);
exports.default = HistoryModel;
