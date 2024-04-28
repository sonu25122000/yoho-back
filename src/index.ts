import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { json } from "body-parser";
import cors from "cors";
import morgan from "morgan";
import initializeDb, { DB_CONNECTION } from "./config/database";
import routes from "./routes";
import { swaggerSpec } from "./config/swagger.config";
import path from "path";
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));
//Middlewares
app.use(json());
app.use(cors());
app.use(morgan("tiny"));
app.use("/api", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Welcome to Yoho.");
});

export let server: any;

// Run the server.
function startServer() {
  server = app.listen(port, async () => {
    initializeDb();
    console.log(
      `${process.env.APP_NAME} app listening on http://localhost:${port}`
    );
  });
  server.setTimeout(500000);
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await DB_CONNECTION.close();
  server.close(() => {
    console.log("HTTP server closed");
  });
});

if (!server) {
  startServer();
}
