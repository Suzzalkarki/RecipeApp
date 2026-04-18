const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 300,
    },
    profileImage: {
      type: String,
      default: '',
    },
    // ✅ NEW — role field
    role: {
      type: String,
      enum: ['chef', 'foodlover'],
      default: 'foodlover',
    },
  },
  { timestamps: true }
);

const Chef = mongoose.model('Chef', chefSchema);
module.exports = Chef;