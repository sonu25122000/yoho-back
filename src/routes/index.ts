import express from "express";
import superAdmin from "./superAdmin";
import recruiter from "./recruiter";
import history from "./history";
const app = express();

app.use("/superAdmin", superAdmin);
app.use("/recruiter", recruiter);
app.use("/history", history);

export default app;
