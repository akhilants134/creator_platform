import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Please provide content"],
    },
    image: {
      type: String,
      default: "default-post-image.jpg",
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      enum: ["Technology", "Lifestyle", "Travel", "Food", "Other"],
      default: "Other",
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
