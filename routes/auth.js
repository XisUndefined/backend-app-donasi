import express from "express";
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from "../controller/authController.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/forgot-password").post(forgotPassword);
router.route("/password-reset/:token").post(resetPassword);

export default router;
