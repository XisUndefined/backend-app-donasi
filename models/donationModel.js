import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  // being reviewed
  invoice: {
    type: String,
    required: true,
  },
  campaign_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  donatur_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donatur",
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
  snap_token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
