"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateTokenResetPassword = exports.generateToken = void 0;
// jwtService.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (userId, JWT_SECRET) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
};
exports.generateToken = generateToken;
const generateTokenResetPassword = (userId, JWT_SECRET) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: "10m" });
};
exports.generateTokenResetPassword = generateTokenResetPassword;
const verifyToken = (token, JWT_SECRET) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
