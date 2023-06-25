import { compare, genSalt, hash } from "bcrypt";
import { User } from "../models/user.model.js";
import {
  createSuccessResponse,
  errorResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/api.response.js";
import _ from "lodash";

export const registerUser = async (req, res) => {
  try {
    let checkEmail = await User.findOne({ email: req.body.email });
    if (checkEmail) return errorResponse("Email is already registered!", res);

    let user = new User(_.pick(req.body, ["name", "email", "password"]));

    const salt = await genSalt(10);
    user.password = await hash(user.password, salt);

    try {
      await user.save();
      return createSuccessResponse(
        "User registered successfully. You can now login",
        {},
        res
      );
    } catch (ex) {
      return errorResponse(ex.message, res);
    }
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};



export const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).select(
      "_id role password"
    );
    if (!user) return errorResponse("Invalid email or password!", res);

    const validPassword = await compare(req.body.password, user.password);
    if (!validPassword) return errorResponse("Invalid email or password!", res);

    const token = user.generateAuthToken();

    return successResponse("Login successful!", { access_token: token }, res);
  } catch (ex) {
    return serverErrorResponse(ex, res);
  }
};




