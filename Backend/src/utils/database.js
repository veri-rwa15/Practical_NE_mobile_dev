import mongoose from "mongoose";
const { connect } = mongoose;
import { config } from "dotenv";
config({ path: "./.env" });

connect("mongodb://127.0.0.1:27017/EUCL_Tokens", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to database successfully"))
  .catch((err) => console.log(err));
