"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const superAdmin_1 = __importDefault(require("./superAdmin"));
const recruiter_1 = __importDefault(require("./recruiter"));
const history_1 = __importDefault(require("./history"));
const app = (0, express_1.default)();
app.use("/superAdmin", superAdmin_1.default);
app.use("/recruiter", recruiter_1.default);
app.use("/history", history_1.default);
exports.default = app;
