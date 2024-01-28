import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";

// import route;

// controller and handler
import globalErrorHandler from "./controller/errorController.js";
import CustomError from "./utils/CustomError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// use route

// 404 Error
app.all("*", (req, res, next) => {
  const err = new CustomError(
    "The resource requested could not be found on the server",
    404
  );
  next(err);
});

app.use(globalErrorHandler);

export default app;
