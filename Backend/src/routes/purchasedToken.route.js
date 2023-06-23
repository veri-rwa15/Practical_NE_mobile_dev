import express from "express";

import { purchaseAToken } from "../controllers/purchasedToken.controller.js";
import { validatePurchasedToken } from "../validators/purchasedToken.validator.js";
const router = express.Router();

router.post("/buy", validatePurchasedToken, purchaseAToken);

export default router;
