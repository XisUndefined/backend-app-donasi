import mongoose from "mongoose";

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
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please insert the category."],
  },
  target_donation: {
    type: Number,
    min: [0, "Target donation can't be negative."],
    required: [true, "Target donation is required."],
  },
  max_date: {
    type: Date,
    required: [true, "Please insert expiration date for the campaign."],
    min: Date.now,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

campaignModel.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
