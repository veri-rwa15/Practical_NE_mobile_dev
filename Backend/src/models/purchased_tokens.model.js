import mongoose from "mongoose";

const purchasedTokenSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 99999999999,
  },
  meterNumber: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  token: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 8,
  },
  tokenStatus: {
    type: String,
    enum: ["USED", "NEW", "EXPIRED"],
    required: true,
  },
  tokenValueDays: {
    type: Number,
    required: true,
    min: 0,
    max: 99999999999,
  },
  purchasedDate: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
    max: 99999999999,
  },
});

export const PurchasedToken = mongoose.model(
  "puschased_tokens",
  purchasedTokenSchema
);
