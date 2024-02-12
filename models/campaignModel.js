import mongoose from "mongoose";
import User from "./userModel.js";
import Category from "./categoryModel.js";
import CustomError from "../utils/customErrorHandler.js";

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please insert the campaign title."],
    unique: true,
    maxlength: [200, "Title can't be longer than 200 characters."],
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please insert the category."],
  },
  targetDonation: {
    type: Number,
    min: [0, "Target donation can't be negative."],
    required: [true, "Target donation is required."],
  },
  maxDate: {
    type: Date,
    required: [true, "Please insert expiration date for the campaign."],
    min: Date.now,
  },
  description: {
    type: String,
    required: [true, "Please insert the description for the campaign."],
    maxlength: [500, "Description cannot be longer than 500 characters."],
  },
  image: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

campaignSchema.pre("save", async function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

campaignSchema.statics.createCampaign = async function (campaignData) {
  const {
    title,
    targetDonation,
    maxDate,
    description,
    image,
    categoryName,
    userId,
  } = campaignData;

  // Find the user ID
  const user = await User.findById(userId);
  if (!user) {
    return next(new CustomError("The requested user could not be found", 404));
  }

  // Find the category ID
  const category = await Category.findOne({ name: categoryName });
  if (!category) {
    const error = new CustomError("Category not found.", 404);
    return next(error);
  }
  const categoryId = category._id;

  // Create the campaign
  const newCampaign = new Campaign({
    title,
    targetDonation,
    maxDate,
    description,
    image,
    categoryId,
    userId,
  });

  // Save the campaign
  await newCampaign.save();

  return newCampaign;
};

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
