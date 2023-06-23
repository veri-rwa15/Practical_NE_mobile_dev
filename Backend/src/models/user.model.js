import mongoose from "mongoose";
const { Schema, model } = mongoose;

import jsonwebtoken from "jsonwebtoken";
const { sign } = jsonwebtoken;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = sign({ _id: this._id }, process.env.JWT.trim());
  return token;
};

export const User = model("user", userSchema);
