import { NextFunction, Request, Response } from "express";
import Joi from "joi";
export const validateRecharge = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const RecruiterSchema = Joi.object({
    coin: Joi.number().integer().positive().required().messages({
      "number.base": "Coin must be a number",
      "number.integer": "Coin must be an integer",
      "number.positive": "Coin must be a positive integer",
      "any.required": "Coin is required",
    }),
  });

  const validationResult = RecruiterSchema.validate(req.body);

  if (validationResult.error) {
    const errMessage = validationResult.error.message;
    console.log(errMessage);
    return res.status(400).json({
      success: false,
      error: errMessage,
    });
  }

  next();
};
