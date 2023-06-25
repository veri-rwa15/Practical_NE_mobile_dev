import mongoose from "mongoose";

const purchasedTokenSchema = new mongoose.Schema({
  meter_number: {
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
  token_status: {
    type: String,
    enum: ["USED", "NEW", "EXPIRED"],
    required: true,
  },
  token_value_days: {
    type: Number,
    required: true,
    min: 0,
    max: 99999999999,
  },
  purchased_date: {
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
  "purchased_tokens",
  purchasedTokenSchema
);