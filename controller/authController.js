import User from "../models/userModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import CustomError from "../utils/customErrorHandler.js";
import jwt from "jsonwebtoken";
import util from "node:util";
import sendEmail from "../utils/emailHandler.js";
import crypto from "node:crypto";

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

const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  sendResposeToken(newUser, 201, res);
});

const login = asyncErrorHandler(async (req, res, next) => {
  // CEK INPUT EMAIL
  const { email, pwd } = req.body;
  if (!email || !pwd) {
    const error = new CustomError("Please insert email and password.", 400);
    return next(error);
  }

  // CEK EMAIL USER TERDAFTAR
  const user = await User.findOne({ email });
  if (!user) {
    const error = new CustomError(
      "The requested user could not be found.",
      400
    );
    return next(error);
  }

  // CEK PASSWORD
  const isMatch = await user.compareInDb(pwd, user.password);
  if (!isMatch) {
    const error = new CustomError("Incorrect email or password.", 400);
    return next(error);
  }

  // MENGIRIM TOKEN
  sendResposeToken(user, 200, res);
});

const protect = asyncErrorHandler(async (req, res, next) => {
  // CEK TOKEN PADA REQUEST HEADER
  const testToken = req.headers.authorization;
  if (!testToken || !testToken.startsWith("bearer")) {
    const error = new CustomError("You are not logged in!", 401);
    return next(error);
  }

  const token = testToken.split(" ")[1];

  // VERIFIKASI TOKEN (MENGAMBIL ID USER DARI PAYLOAD)
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // MENGECEK USER MELALUI ID USER PADA PAYLOAD
  const user = await User.findById(decodedToken.id);

  if (!user) {
    return next(
      new CustomError("The user with the given token does not exist", 401)
    );
  }

  // MENGECEK APAKAH PASSWORD DIGANTI
  const isChanged = await user.compareTimestamp(
    decodedToken.iat,
    user.passwordChangedAt
  );
  if (isChanged) {
    return next(
      new CustomError(
        "The password has been changed recently. Please login again!",
        401
      )
    );
  }

  // ASSIGN USER KEDALAM VARIABLE REQUEST
  req.user = user;
  next();
});

const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  // MENGECEK KEBERADAAN USER MELALUI INPUT EMAIL
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new CustomError("We could not find the user with the given email.", 404)
    );
  }

  // MEMBUAT RESET TOKEN
  const resetToken = await user.createPwdToken();
  await user.save({ validateBeforeSave: false });

  // MEMBUAT RESET URL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/users/reset-password/${resetToken}`;
  const message = `we have recieved a password reset request. Please use the below link to reset your password.\n\n${resetUrl}\n\nThis reset password link will be valid only for 10 minutes.`;

  // MENGIRIM RESET URL KE EMAIL USER
  try {
    await sendEmail({
      email: user.email,
      subject: "Reset your password",
      message,
    });
  } catch (err) {
    user.passwordToken = undefined;
    user.passwordTokenExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(
      new CustomError(
        "There was an error sending password email. Please try again later",
        500
      )
    );
  }

  // MENGIRIM JWT TOKEN
  sendResposeToken(user, 200, res);
});

const resetPassword = asyncErrorHandler(async (req, res, next) => {
  // DECRYPT TOKEN YANG DIKIRIM MELALUI REQUEST PARAMETER
  const pwdToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // MENGECEK KEBERADAAN USER
  const user = await User.findOne({ passwordToken: pwdToken });

  if (!user) {
    const error = new CustomError("The reset password token is invalid!", 404);
    return next(error);
  }

  // MENGECEK RESET TOKEN APAKAH EXPIRED
  const isNotExpired = await user.compareTimestamp(
    Date.now(),
    user.passwordTokenExpires
  );

  if (!isNotExpired) {
    return next(new CustomError("The reset password token has expired!", 400));
  }

  // RESET PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordToken = undefined;
  user.passwordTokenExpires = undefined;
  user.updatedAt = Date.now();
  user.passwordChangedAt = Date.now();

  await user.save();

  // MENGIRIM JWT TOKEN
  sendResposeToken(user, 200, res);
});

export { signup, login, protect, forgotPassword, resetPassword };
