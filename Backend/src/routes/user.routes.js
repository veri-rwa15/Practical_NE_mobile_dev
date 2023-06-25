import express from "express";
import {
  login,
  registerUser,
} from "../controllers/user.controller.js";
import {
  validateLogin,
  validateUserRegistration,
} from "../validators/user.validator.js";
const router = express.Router();


router.post("/register", validateUserRegistration, registerUser);

router.post("/login", validateLogin, login);

export default router;
