import { number } from "joi";
import mongoose, { Schema } from "mongoose";
export enum PurchaseType {
  SELL = "sell",
  BUY = "buy",
}

export enum Status {
  APPROVED = "approved",
  PENDING = "pending",
  RJECTED = "rejected",
}

export interface HistoryDocument extends mongoose.Document {
  recruiterID: mongoose.Types.ObjectId;
  adminID: mongoose.Types.ObjectId;
  purchaseType?: PurchaseType;
  status: Status;
  coin: number;
  YohoId: string;
}

export const HistorySchema = new mongoose.Schema(
  {
    recruiterID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Recruiter",
    },
    adminID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "SuperAdmin",
    },
    purchaseType: {
      type: String,
      enum: Object.values(PurchaseType),
    },
    coin: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(Status),
    },
    YohoId: { type: String },
  },
  { timestamps: true, versionKey: false }
);

const HistoryModel = mongoose.model<HistoryDocument>("History", HistorySchema);

export default HistoryModel;
