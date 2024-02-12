import mongoose from "mongoose";
import User from "./userModel";
import CustomError from "../utils/customErrorHandler";

const donationSchema = new mongoose.Schema({
  // being reviewed
  invoice: {
    type: String,
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: [true, "Insert the amount donations."],
    min: [0, "The amount of donation cannot be less than 0."],
  },
  pray: {
    type: String,
    required: [true, "Please insert your prayers."],
    maxlength: [500, "Prayer cannot be longer than 500 characters."],
  },
  // being reviewed
  status: {
    type: String,
    enum: ["pending", "success", "expired", "failed"],
    required: true,
  },
  // being reviewed
  snapToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

donationSchema.statics.createDonation = async function (donationData) {
  const { invoice, slug, amount, pray, status, snapToken, userId } =
    donationData;

  const user = await User.findById(userId);
  if (!user) {
    return next(new CustomError("The requested user could not be found", 404));
  }

  const campaign = await User.findOne({ slug });
  if (!campaign) {
    return next(
      new CustomError("The requested campaign could not be found", 404)
    );
  }
  const campaignId = campaign._id;
  const newDonation = new Donation({
    invoice,
    campaignId,
    userId,
    amount,
    pray,
    status,
    snapToken,
  });

  await newDonation.save();

  return newDonation;
};

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
