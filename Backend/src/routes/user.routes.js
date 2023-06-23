import express from "express";
import {
  checkIfUserVoted,
  getProfile,
  login,
  registerAsVoter,
  registerUser,
} from "../controllers/user.controller.js";
import {
  validateLogin,
  validateUserRegistration,
} from "../validators/user.validator.js";
import authenticate from "../middlewares/auth.middleware.js";
import voter from "../middlewares/voter.middleware.js";
const router = express.Router();

router.get("/profile", authenticate, getProfile);

router.get("/has-voted", authenticate, voter, checkIfUserVoted);

router.post("/register", validateUserRegistration, registerUser);

router.post("/voter/register", validateUserRegistration, registerAsVoter);

router.post("/login", validateLogin, login);

export default router;
