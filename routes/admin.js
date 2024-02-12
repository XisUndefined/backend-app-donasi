import express from "express";
import { protect } from "../controller/authController.js";

const router = express.Router();

// router.route("/").get(protect, adminController, controller);

// router
//   .route("/category")
//   .get(protect, adminController, controller)
//   .post(protect, adminController, controller)
//   .patch(protect, adminController, controller)
//   .delete(protect, adminController, controller);

// router
//   .route("/campaign")
//   .get(protect, adminController, controller)
//   .post(protect, adminController, controller)
//   .patch(protect, adminController, controller)
//   .delete(protect, adminController, controller);

// router.route("/donatur").get(protect, adminController, controller);

// router.route("/donation").get(protect, adminController, controller);

// router
//   .route("/profile")
//   .get(protect, adminController, controller)
//   .patch(protect, adminController, controller);

// router
//   .route("/slider")
//   .get(protect, adminController, controller)
//   .post(protect, adminController, controller)
//   .delete(protect, adminController, controller);

export default router;
