"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = require("body-parser");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = __importStar(require("./config/database"));
const routes_1 = __importDefault(require("./routes"));
const swagger_config_1 = require("./config/swagger.config");
const path_1 = __importDefault(require("path"));
const swaggerUi = require("swagger-ui-express");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
//Middlewares
app.use((0, body_parser_1.json)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use("/api", routes_1.default);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swagger_config_1.swaggerSpec));
app.get("/", (req, res) => {
    res.send("Welcome to Yoho.");
});
// Run the server.
function startServer() {
    exports.server = app.listen(port, () => __awaiter(this, void 0, void 0, function* () {
        (0, database_1.default)();
        console.log(`${process.env.APP_NAME} app listening on http://localhost:${port}`);
    }));
    exports.server.setTimeout(500000);
}
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("SIGTERM signal received: closing HTTP server");
    yield database_1.DB_CONNECTION.close();
    exports.server.close(() => {
        console.log("HTTP server closed");
    });
}));
if (!exports.server) {
    startServer();
}
