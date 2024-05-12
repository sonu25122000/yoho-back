import { Request, Response } from "express";
import { handleMongoError } from "../utils/handleMongoError";

import HistoryModel, { PurchaseType, Status } from "../models/History";
import mongoose, { isValidObjectId } from "mongoose";
import SuperAdminModel from "../models/SuperAdmin";
import RecruiterModel from "../models/Recruiter";

const getHistory = async (req: Request, res: Response) => {
  const { status } = req.query;
  try {
    let query: any = {};
    if (status) {
      if (status === "pending") {
        query.status = "pending"; // If status is 'pending', filter only pending records
      } else {
        query.status = { $ne: "pending" }; // If status is other than 'pending', filter records other than pending
      }
    }
    const history = await HistoryModel.find(query).populate({
      path: "recruiterID",
    });
    return res.status(200).json({
      success: true,
      message: "History List.",
      data: history,
    });
  } catch (error) {
    console.log("Error while fetching the history List.");
    handleMongoError(error, res);
  }
};

// buy request approve
const approvRecharge = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // history id
    const { id } = req.params;
    const { adminID, coin, recruiterID } = req.body;
    if (!isValidObjectId(recruiterID) || !isValidObjectId(adminID)) {
      return res.status(400).json({
        success: false,
        message: "Either admin id or recruiter id not valid.",
      });
    }

    const history = await HistoryModel.findById(id).session(session);
    if (!history) {
      return res
        .status(404)
        .json({ success: false, error: "history not found" });
    }
    // Fetch the admin from the database
    const admin = await SuperAdminModel.findById(adminID).session(session);
    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    // Fetch the user from the database
    const recruiter = await RecruiterModel.findById(recruiterID).session(
      session
    );
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, error: "recruiter not found" });
    }

    // commission earned by recruiter
    const totalCoinEarned = (coin * recruiter.commision) / 100;

    // Update admin's coin balance
    admin.coin -= coin;

    // Validate admin's updated coin balance
    if (admin.coin < 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, error: "Insufficient coins in admin account" });
    }

    // Update user's coin balance
    recruiter.coin += coin;

    // added commssion earned coin in total commsion
    recruiter.totalCommissionEarned += Number(totalCoinEarned.toFixed(2));
    history.status = Status.APPROVED;

    // Save changes to admin and user
    await admin.save();
    await recruiter.save();
    await history.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Recharged Requested Approved",
    });
  } catch (error) {
    console.error("Error in rechargeUser controller:", error);
    await session.abortTransaction();
    session.endSession();
    handleMongoError(error, res);
  }
};

const rejectRecharge = async (req: Request, res: Response) => {
  try {
    // history id
    const { id } = req.params;
    const { recruiterID } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "history id not valid.",
      });
    }
    const history = await HistoryModel.findById(id);
    if (!history) {
      return res
        .status(404)
        .json({ success: false, error: "history not found" });
    }

    // Fetch the user from the database
    const recruiter = await RecruiterModel.findById(recruiterID);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, error: "recruiter not found" });
    }

    history.status = Status.RJECTED;
    recruiter.rechargeStatus = Status.RJECTED;
    // Save changes to admin and user
    await recruiter.save();
    await history.save();

    return res.status(200).json({
      success: true,
      message: "Recharged Requested Rejected",
    });
  } catch (error) {
    console.error("Error in rechargeUser controller:", error);

    handleMongoError(error, res);
  }
};

const approveSellRecharge = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // history id
    const { id } = req.params;
    const { coin, recruiterID } = req.body;
    if (!isValidObjectId(recruiterID)) {
      return res.status(400).json({
        success: false,
        message: "Recruiter id not valid.",
      });
    }
    const history = await HistoryModel.findById(id).session(session);
    if (!history) {
      return res
        .status(404)
        .json({ success: false, error: "history not found" });
    }
    // Fetch the admin from the database

    // Fetch the user from the database
    const recruiter = await RecruiterModel.findById(recruiterID).session(
      session
    );
    console.log(recruiter);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, error: "recruiter not found" });
    }
    // Validate admin's updated coin balance
    if (recruiter.coin < 0 || recruiter.coin < coin) {
      console.log("================");
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "Insufficient coins in Recruiter account",
      });
    }
    // if (recruiter.coin) {
    recruiter.coin -= coin;
    const commision = (+coin * recruiter.commision) / 100;
    recruiter.unlockCommission += commision;
    // }

    // Update user's coin balance
    history.status = Status.APPROVED;
    recruiter.rechargeStatus = Status.APPROVED;
    await recruiter.save();
    await history.save();

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      success: true,
      message: "Sell Recharged Requested Approved.",
    });
  } catch (error) {
    console.error("Error in sell rechargeUser controller:", error);
    await session.abortTransaction();
    session.endSession();
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

const rejectSellRecharge = async (req: Request, res: Response) => {
  try {
    // history id
    const { id } = req.params;
    const { recruiterID } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "history id not valid.",
      });
    }
    const history = await HistoryModel.findById(id);
    if (!history) {
      return res
        .status(404)
        .json({ success: false, error: "history not found" });
    }

    // Fetch the user from the database
    const recruiter = await RecruiterModel.findById(recruiterID);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, error: "recruiter not found" });
    }

    history.status = Status.RJECTED;
    recruiter.rechargeStatus = Status.RJECTED;
    // Save changes to admin and user
    await recruiter.save();
    await history.save();

    return res.status(200).json({
      success: true,
      message: "Recharged Requested Rejected",
    });
  } catch (error) {
    console.error("Error in rechargeUser controller:", error);

    handleMongoError(error, res);
  }
};

const getTodaysSell = async (req: Request, res: Response) => {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for comparison

    // Get midnight of the next day to include purchases made up until end of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find all documents where purchaseType is "buy" and created today
    const totalCoin = await HistoryModel.find({
      purchaseType: PurchaseType.BUY,
      status: Status.APPROVED,
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    // Calculate total coin
    let total = 0;
    totalCoin.forEach((item) => {
      total += item.coin;
    });

    // Return totalCoin
    res.json({ success: true, message: "Today's Sell Coin", data: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getMonthlySell = async (req: Request, res: Response) => {
  try {
    const currentMonth = new Date().getMonth() + 1; // Get current month
    const currentYear = new Date().getFullYear(); // Get current year

    const result = await HistoryModel.aggregate([
      {
        $match: {
          purchaseType: PurchaseType.BUY,
          status: Status.APPROVED,
          $expr: {
            $and: [
              { $eq: [{ $month: "$createdAt" }, currentMonth] },
              { $eq: [{ $year: "$createdAt" }, currentYear] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCoinSellValue: { $sum: "$coin" },
        },
      },
    ]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No data found for the current month" });
    }

    return res.status(200).json({
      success: true,
      message: "monthly sell data",
      data: result[0].totalCoinSellValue,
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveWithDraw = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amountToWithDraw, recruiterID } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Provided ID is not valid",
      });
    }
    const recruiter = await RecruiterModel.findById(recruiterID);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter Not Found",
      });
    }
    const history = await HistoryModel.findById(id);
    if (!history) {
      return res.status(404).json({
        success: false,
        message: "History Not Found",
      });
    }
    if (amountToWithDraw > recruiter.unlockCommission) {
      return res.status(400).json({
        success: false,
        message:
          "Insufficient amount to withDraw.only unlockCommission you can withdraw.",
      });
    }
    recruiter.unlockCommission -= amountToWithDraw.toFixed(2);
    recruiter.totalCommissionEarned -= amountToWithDraw.toFixed(2);
    history.status = Status.APPROVED;
    await recruiter.save();
    await history.save();
    return res.status(200).json({
      success: false,
      message: "WithDraw commission Request Approved",
    });
  } catch (error) {
    console.log("error while with draw the commission", error);
    handleMongoError(error, res);
  }
};

export const historyController = {
  getHistory,
  approvRecharge,
  rejectRecharge,
  approveSellRecharge,
  rejectSellRecharge,
  getTodaysSell,
  getMonthlySell,
  approveWithDraw,
};
