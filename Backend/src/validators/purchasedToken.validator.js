import Joi from "joi";
import { errorResponse } from "../utils/api.response.js";

export async function validatePurchasedToken(req, res, next) {
  try {
    const schema = Joi.object({
      meter_number: Joi.string().length(6).required().label("Meter Number"),
      amount: Joi.number().required().label("Amount"),
    });

    const { error } = schema.validate(req.body);
    if (error) return errorResponse(error.message, res);

    return next();
  } catch (ex) {
    return errorResponse(ex.message, res);
  }
}
