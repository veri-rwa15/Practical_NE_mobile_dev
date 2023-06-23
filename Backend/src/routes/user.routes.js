import express from "express";
import {
  getProfile,
  login,
  registerUser,
} from "../controllers/user.controller.js";
import {
  validateLogin,
  validateUserRegistration,
} from "../validators/user.validator.js";
import authenticate from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/profile", authenticate, getProfile);

router.post("/register", validateUserRegistration, registerUser);

router.post("/login", validateLogin, login);

export default router;
