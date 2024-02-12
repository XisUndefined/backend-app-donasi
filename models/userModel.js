import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please insert your name."],
    trim: true,
    maxlength: [50, "Firstname can't be longer than 50 characters."],
  },
  lastname: {
    type: String,
    trim: true,
    maxlength: [50, "Last name can't be longer than 50 characters."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email address."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must be at least 8 characters long."],
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password do not match.",
    },
    trim: true,
  },
  avatar: {
    type: String,
    default: function () {
      if (this.lastname) {
        return `https://ui-avatars.com/api/?name=${this.firstname}+${this.lastname}&size=128`;
      } else {
        return `https://ui-avatars.com/api/?name=${this.firstname}&size=128`;
      }
    },
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },
  passwordToken: {
    type: String,
  },
  passwordTokenExpires: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  this.confirmPassword = undefined;
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.compareInDb = async function (str, strDB) {
  return await bcrypt.compare(str, strDB);
};

userSchema.methods.compareTimestamp = async function (
  varTimestamp,
  dbTimestamp
) {
  const changedTimestamp = parseInt(dbTimestamp.getTime() / 1000);
  return varTimestamp < changedTimestamp;
};

userSchema.methods.createPwdToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
