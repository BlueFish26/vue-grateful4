const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema(
  {
    app_name: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    handle: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    date: { type: Date, default: Date.now },
    motto: { type: String, required: true, maxlength: 500 },
    numbers: {
      friends: { type: Number },
      followers: { type: Number },
      follwing: { type: Number },
    },
    likedPosts: [{ type: Schema.Types.ObjectId, ref: 'post', unique: true }],
  },
  {
    collation: { locale: 'en', strength: 2 },
  }
);
const User = mongoose.model('user', UserSchema);
module.exports = User;
