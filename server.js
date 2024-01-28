import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

// console.log(process.env);

mongoose
  .connect(process.env.LOCAL_CONN_STR, { dbName: process.env.DB_NAME })
  .then(() => console.log("Database Connection Successful."));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening to http://localhost:${port}`);
});
