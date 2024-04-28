"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SALT = exports.JWT_SECRET = void 0;
const dotenvResult = require("dotenv");
dotenvResult.config();
if (dotenvResult.error) {
    console.error("Error loading .env file:", dotenvResult.error);
}
// config.ts
exports.JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
exports.JWT_SALT = process.env.SUPERADMIN_SALT || 10;
