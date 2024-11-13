import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({ path: "./env" });
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Server is running!");
});

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log("Database is connected!");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
