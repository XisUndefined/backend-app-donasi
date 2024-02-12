import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customErrorHandler.js";
import jwt from "jsonwebtokenl";

const sendResposeToken = (user, statusCode, res) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  user.password = undefined;
  res.status(statusCode).json({
    status:
      statusCode >= 200 && statusCode < 300
        ? "success"
        : statusCode >= 400 && statusCode < 500
        ? "fail"
        : "error",
    token,
    data: {
      user,
    },
  });
};

const updatePassword = asyncErrorHandler(async (req, res, next) => {
  // MENGECEK KEBERADAAN EMAIL MELALUI ID
  const user = await User.findById(req.user._id);

  // MEMVALIDASI INPUT UNTUK PASSWORD LAMA
  const isMatch = await user.compareInDb(req.body.oldPassword, user.password);
  if (!isMatch) {
    const error = new CustomError(
      "The current password you provided is not correct",
      401
    );
    return next(error);
  }

  // UPDATE PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.changedAt = Date.now();
  user.passwordChangedAt = Date.now();

  await user.save();

  // MENGIRIM JWT TOKEN
  sendResposeToken(user, 200, res);
});

export { updatePassword };
