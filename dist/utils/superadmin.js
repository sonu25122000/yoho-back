"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRecharge = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRecharge = (req, res, next) => {
    const RecruiterSchema = joi_1.default.object({
        coin: joi_1.default.number().integer().positive().required().messages({
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
exports.validateRecharge = validateRecharge;
