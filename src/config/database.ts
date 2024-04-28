import mongoose, { ConnectOptions, Connection } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export let DB_CONNECTION: Connection;

const connectToDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw Error("Database link missing in .env");
    }
    await mongoose.connect(mongoUri).then(
      () => {
        console.log("Connected to database successfully!");
      },
      (err) => {
        console.log(`Database connection error: ${err}`);
      }
    );

    DB_CONNECTION = mongoose.connection;
    DB_CONNECTION.on(
      "error",
      console.error.bind(console, "Database connection error")
    );
    DB_CONNECTION.once("open", () => {
      console.log("Connected to database successfuly");
    });
  } catch (error) {
    console.error(`Database connection error: ${error}`);
    process.exit(1);
  }
};

export const initializeDb = async () => {
  await connectToDB();
};

export default initializeDb;
