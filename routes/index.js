import express from "express";
import { protect } from "../controller/authController.js";
import { updatePassword } from "../controller/userController.js";

const router = express.Router();

// router.route("/").get(controller);
// router.route("/category").get(controller);
// router.route("/category/:slug").get(controller);
// router.route("/campaign").get(controller);
// router.route("/campaign/:slug").get(controller);
// router.route("/donation").get(protect, controller).post(protect, controller);
// router.route("/profile").get(protect, controller).post(protect, controller);
// router.route("/profile/password").patch(protect, updatePassword);

export default router;
