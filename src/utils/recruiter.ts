import { NextFunction, Request, Response } from "express";
import Joi from "joi";
export const validateRecruiterDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const RecruiterSchema = Joi.object({
    firstName: Joi.string().min(3).max(50).required().messages({
      "string.base": "firstName must be a string",
      "string.empty": "firstName is required",
      "string.min": "firstName must be at least 3 characters long",
      "string.max": "firstName cannot be longer than 50 characters",
      "any.required": "firstName is required.",
    }),
    lastName: Joi.string().min(3).max(50).required().messages({
      "string.base": "lastName must be a string",
      "string.empty": "lastName is required",
      "string.min": "lastName must be at least 3 characters long",
      "string.max": "lastName cannot be longer than 50 characters",
      "any.required": "lastName is required.",
    }),

    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required.",
    }),
    phoneNumber: Joi.string().regex(/^\d+$/).length(10).required().messages({
      "string.base": "Phone number must be a string",
      "string.empty": "Phone number is required",
      "string.length": "Phone number must be exactly 10 digits long",
      "string.pattern.base": "Phone number must contain only digits",
      "any.required": "Phone number is required",
    }),
    password: Joi.string().min(6).max(50).required().messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password cannot be longer than 50 characters",
      "any.required": "Password is required.",
    }),

    commision: Joi.number().positive().required().messages({
      "number.positive": "commision must be a positive integer",
      "any.required": "commision is required",
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

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const RecruiterSchema = Joi.object({
    newPassword: Joi.string().min(6).max(50).required().messages({
      "string.base": "newPassword must be a string",
      "string.empty": "newPassword is required",
      "string.min": "newPassword must be at least 6 characters long",
      "string.max": "newPassword cannot be longer than 50 characters",
      "any.required": "newPassword is required.",
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
