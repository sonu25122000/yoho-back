import mongoose from "mongoose";

export interface SuperAdminDocument extends mongoose.Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  coin: number;
  pin: number;
}

export const SuperAdminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    coin: { type: Number, default: 0 },
    pin: { type: Number, required: false, default: null },
  },
  { timestamps: true }
);

const SuperAdminModel = mongoose.model<SuperAdminDocument>(
  "SuperAdmin",
  SuperAdminSchema
);

export default SuperAdminModel;
