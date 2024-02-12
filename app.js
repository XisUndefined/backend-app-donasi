// IMPORT PACKAGE
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";

// IMPORT ROUTE
import adminRouter from "./routes/admin.js";
import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";

// IMPORT CONTROLLER AND HANDLER
import globalErrorHandler from "./controller/errorController.js";
import CustomError from "./utils/customErrorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// USE ROUTE
app.use("/admin", adminRouter);
app.use("/api", indexRouter);
app.use("/api/auth", authRouter);

// 404 Error
app.all("*", (req, res, next) => {
  const err = new CustomError(
    "The resource requested could not be found on the server",
    404
  );
  next(err);
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
