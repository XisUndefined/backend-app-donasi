import "dotenv/config";
import app from "./app.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.DB_LOCAL_CONN_STR, { dbName: process.env.DB_NAME })
  .then(() => console.log("Database Connection Successful."))
  .catch((error) => console.error("Database Connection Error.", error));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening to http://localhost:${port}`);
});
