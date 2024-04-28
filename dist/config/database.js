"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDb = exports.DB_CONNECTION = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connectToDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw Error("Database link missing in .env");
        }
        yield mongoose_1.default.connect(mongoUri).then(() => {
            console.log("Connected to database successfully!");
        }, (err) => {
            console.log(`Database connection error: ${err}`);
        });
        exports.DB_CONNECTION = mongoose_1.default.connection;
        exports.DB_CONNECTION.on("error", console.error.bind(console, "Database connection error"));
        exports.DB_CONNECTION.once("open", () => {
            console.log("Connected to database successfuly");
        });
    }
    catch (error) {
        console.error(`Database connection error: ${error}`);
        process.exit(1);
    }
});
const initializeDb = () => __awaiter(void 0, void 0, void 0, function* () {
    yield connectToDB();
});
exports.initializeDb = initializeDb;
exports.default = exports.initializeDb;
