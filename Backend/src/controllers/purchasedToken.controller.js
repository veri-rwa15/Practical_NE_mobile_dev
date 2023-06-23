import { PurchasedToken } from "../models/purchased_tokens.model.js";
import {
  errorResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/api.response.js";
export const validateAToken = async (req, res) => {
  try {
    const { token } = req.params;
    const findToken = await PurchasedToken.findOne({ token });
    if (!findToken)
      return notFoundResponse("token", token, "Purchased Tokens", res);
    // Check if the token has expired
    const currentDate = new Date();
    const tokenExpirationDate = new Date(findToken.purchased_date);
    tokenExpirationDate.setDate(
      tokenExpirationDate.getDate() + findToken.token_value_days
    );
    if (currentDate > tokenExpirationDate) {
      // Token has expired
      findToken.token_status = "EXPIRED";
    } else {
      // Token is still valid
      findToken.token_status = "USED";
    }
    // Save the updated token status
    await findToken.save();
    return successResponse("Token info", findToken, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
export const getTokensByMeterNumber = async (req, res) => {
  try {
    const { meter_number } = req.params;
    const findTokensByMeterNumber = await PurchasedToken.find({ meter_number });
    return successResponse("Tokens", findTokensByMeterNumber, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
export const purchaseAToken = async (req, res) => {
  try {
    const { amount, meter_number } = req.body;
    if (amount < 100)
      return errorResponse(
        "Amount should be greater than or equal to 100 RWF",
        res
      );
    const token = generateUniqueToken(meter_number);
    const tokenValueDays = Math.floor(amount / 100);
    if (tokenValueDays > 365 * 5)
      return errorResponse("Token duration cannot exceed 5 years", res);
    const purchasedToken = new PurchasedToken({
      meter_number,
      token,
      token_status: "NEW",
      token_value_days: tokenValueDays,
      amount,
    });
    await purchasedToken.save();
    return successResponse(res, "Token purchased successfully", res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};
function generateUniqueToken(meterNumber) {
  const timestamp = Date.now().toString().slice(-3);
  const meterDigits = meterNumber.slice(-3);
  let randomDigits = "";
  for (let i = 0; i < 2; i++) {
    randomDigits += Math.floor(Math.random() * 10).toString();
  }
  return `${timestamp}${meterDigits}${randomDigits}`;
}
