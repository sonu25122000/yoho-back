// authController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import SuperAdminModel from "../models/SuperAdmin";
import { handleMongoError } from "../utils/handleMongoError";
import { JWT_SECRET, JWT_SALT } from "../service/jwtSecret";
import { generateToken } from "../service/jwtService";

const register = async (req: Request, res: Response) => {
  // Handle superAdmin registration
  const { firstName, lastName, email, password, phoneNumber } = req.body;

  try {
    // Check if superAdmin already existss
    const existingSuperAdmin = await SuperAdminModel.findOne({ phoneNumber });
    if (existingSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: `SuperAdmin already exists with ${phoneNumber}`,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, JWT_SALT);

    // Create new superAdmin
    const newSuperAdmin = new SuperAdminModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await newSuperAdmin.save();

    return res
      .status(201)
      .json({ success: true, message: "SuperAdmin registered successfully" });
  } catch (error: any) {
    console.error("Error in SuperAdmin registration:", error);
    handleMongoError(error, res);
  }
};

const login = async (req: Request, res: Response) => {
  // Handle SuperAdmin login
  const { phoneNumber, password } = req.body;

  try {
    // Find SuperAdmin by email
    const SuperAdmin = await SuperAdminModel.findOne({ phoneNumber });
    if (!SuperAdmin) {
      return res.status(404).json({
        success: false,
        message: `Phone Number ${phoneNumber} is not registered.`,
      });
    }

    // Verify password
    if (!(await bcrypt.compare(password, SuperAdmin.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const token = generateToken(SuperAdmin._id, JWT_SECRET);

    // Return JWT token or other authentication response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: SuperAdmin,
    });
  } catch (error) {
    console.error("Error in user login:", error);
    handleMongoError(error, res);
  }
};

const rechargeCoin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provided ID is not valid",
      });
    }
    const { coin } = req.body;
    const superAdmin = await SuperAdminModel.findById(id);
    if (!superAdmin) {
      return res.status(404).json({
        success: false,
        message: "SuperAdmin not found",
      });
    }
    await SuperAdminModel.findByIdAndUpdate(
      id,
      { coin: superAdmin.coin + coin },
      { new: true }
    );
    return res.status(200).json({
      success: false,
      message: "Recharge Successfull.",
    });
  } catch (error) {
    console.log(error);
    handleMongoError(error, res);
  }
};

const getSuperAdminById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Provided ID is not valid",
      });
    }
    const superAdmin = await SuperAdminModel.findById(id);
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
  } catch (error) {
    console.log(error);
    handleMongoError(error, res);
  }
};
const getAllSuperAdmin = async (req: Request, res: Response) => {
  try {
    const superAdmin = await SuperAdminModel.find();
    return res.status(200).json({
      success: true,
      message: "SuperAdmin Details",
      data: superAdmin,
    });
  } catch (error) {
    console.log(error);
    handleMongoError(error, res);
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.body.user;
    // Find user by email
    const user = await SuperAdminModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "SuperAdmin Not Found",
      });
    }

    // Verify current password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Old Password",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // Update user's password in the database
    user.password = hashedPassword;
    await user.save();

    // Send success response
    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    handleMongoError(error, res);
  }
};

export const superAdminController = {
  register,
  login,
  rechargeCoin,
  getSuperAdminById,
  getAllSuperAdmin,
  changePassword,
};
