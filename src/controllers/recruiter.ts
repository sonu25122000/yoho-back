import { Request, Response } from "express";
import RecruiterModel from "../models/Recruiter";
import bcrypt from "bcryptjs";
import { JWT_SALT, JWT_SECRET } from "../service/jwtSecret";
import { handleMongoError } from "../utils/handleMongoError";
import { generateToken } from "../service/jwtService";
import mongoose, { isValidObjectId } from "mongoose";
import SuperAdminModel from "../models/SuperAdmin";
import HistoryModel, { PurchaseType, Status } from "../models/History";

const register = async (req: Request, res: Response) => {
  // Handle Recruiter registration
  const {
    firstName,
    lastName,
    email,
    password,
    YohoId,
    phoneNumber,
    commision,
  } = req.body;

  try {
    // Check if Recruiter already exists
    const existingRecruiter = await RecruiterModel.findOne({ phoneNumber });
    if (existingRecruiter) {
      return res.status(400).json({
        success: false,
        message: "Recruiter already exists with the same phoneNumber.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, JWT_SALT);

    // Create new Recruiter
    const newRecruiter = new RecruiterModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      commision,
      YohoId,
    });

    await newRecruiter.save();

    return res
      .status(201)
      .json({ success: true, message: "Recruiter registered successfully" });
  } catch (error: any) {
    console.error("Error in Recruiter registration:", error);
    handleMongoError(error, res);
  }
};

const login = async (req: Request, res: Response) => {
  // Handle Recruiter login
  const { phoneNumber, password } = req.body;

  try {
    // Find Recruiter by email
    const Recruiter = await RecruiterModel.findOne({ phoneNumber });
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
    if (!(await bcrypt.compare(password, Recruiter.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Error in user login:", error);
    handleMongoError(error, res);
  }
};

const updateRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    const updateRecruiterDetails = await RecruiterModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Updated Successfully.",
      data: updateRecruiterDetails,
    });
  } catch (error) {
    console.error("Error in updaing recruiter details:", error);
    handleMongoError(error, res);
  }
};

const softDeletedRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    await RecruiterModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return res.status(200).json({
      success: true,
      message: "Recruiter Deleted SuccessFully.",
    });
  } catch (error) {
    console.error("Error in Deleting recruiter:", error);
    handleMongoError(error, res);
  }
};
const deactivatedRecruiter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    await RecruiterModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
    return res.status(200).json({
      success: true,
      message: "Recruiter Deleted SuccessFully.",
    });
  } catch (error) {
    console.error("Error in Deleting recruiter:", error);
    handleMongoError(error, res);
  }
};
const changePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid.`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id);
    if (!Recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found.",
      });
    }

    const { newPassword } = req.body;
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, JWT_SALT);

    await RecruiterModel.findByIdAndUpdate(
      id,
      {
        password: hashedPassword,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

const getAllRecruiter = async (req: Request, res: Response) => {
  try {
    const data = await RecruiterModel.find({ isDeleted: false }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      message: "list of all recruiter.",
      data: data,
    });
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

const getRecruiterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Provided ID : ${id} is not valid`,
      });
    }
    const Recruiter = await RecruiterModel.findById(id).select("-password");
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
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

const recharge = async (req: Request, res: Response) => {
  try {
    // recruiter id
    const { id } = req.params;
    const { adminID, YohoId, coin } = req.body;
    const recruiter = await RecruiterModel.findById(id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found.",
      });
    }
    const addHistory = new HistoryModel({
      recruiterID: recruiter._id,
      purchaseType: PurchaseType.BUY,
      status: Status.PENDING,
      coin: coin,
      YohoId,
      adminID: adminID,
    });
    recruiter.rechargeStatus = Status.PENDING;

    await addHistory.save();
    await recruiter.save();
    return res.status(200).json({
      success: true,
      message: "Recharge Requested.",
    });
  } catch (error) {
    console.error("Error in rechargeUser controller:", error);
    handleMongoError(error, res);
  }
};

export const reCruiterController = {
  register,
  login,
  updateRecruiter,
  softDeletedRecruiter,
  getAllRecruiter,
  getRecruiterById,
  changePassword,
  deactivatedRecruiter,
  recharge,
};
