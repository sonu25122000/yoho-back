import { number } from "joi";
import mongoose, { Schema } from "mongoose";
export enum PurchaseType {
  SELL = "sell",
  BUY = "buy",
  WITHDRAW = "withdraw",
}
export enum Status {
  APPROVED = "approved",
  PENDING = "pending",
  RJECTED = "rejected",
}
export interface HistoryDocument extends mongoose.Document {
  recruiterID: mongoose.Types.ObjectId;
  adminID?: mongoose.Types.ObjectId;
  purchaseType?: PurchaseType;
  status: Status;
  coin: number;
  YohoId?: string;
  fullName: string;
  phoneNumber: number;
  amount: number;
  upiId: string;
  note: string;
  remark: string;
}

export const HistorySchema = new mongoose.Schema(
  {
    recruiterID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Recruiter",
    },
    fullName: { type: String },
    adminID: {
      type: Schema.Types.ObjectId,
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
    remark: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

const HistoryModel = mongoose.model<HistoryDocument>("History", HistorySchema);

export default HistoryModel;
