const dotenvResult = require("dotenv");
dotenvResult.config();

if (dotenvResult.error) {
  console.error("Error loading .env file:", dotenvResult.error);
}
// config.ts
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

export const JWT_SALT = process.env.SUPERADMIN_SALT || 10;
