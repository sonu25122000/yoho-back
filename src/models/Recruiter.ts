import mongoose from "mongoose";

export interface RecruiterDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: number;
  isDeactivated?: boolean;
  isDeleted?: boolean;
  coin?: number;
  commision?: number;
  YohoId?: string;
  rechargeStatus?: Status;
  commissionEarned?: number;
}

export enum Status {
  APPROVED = "approved",
  PENDING = "pending",
  RJECTED = "rejected",
}

export const RecruiterSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const RecruiterModel = mongoose.model<RecruiterDocument>(
  "Recruiter",
  RecruiterSchema
);

export default RecruiterModel;
