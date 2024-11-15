const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],  // Ensure title is required
  },
  ingredients: {
    type: String,  // You can also use an array of strings if you prefer
    required: true,
  },
  directions: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: [true, "Image is required"],  // Ensure image is required
  },
  cloudinaryId: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

