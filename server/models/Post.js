const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    app_name: { type: String, required: true },
    email: { type: String, required: true },
    media: { type: String },
    text: { type: String, required: true },
    likes: [{ email: { type: String } }],
    date: { type: Date, default: Date.now },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'user' },
        handle: { type: String, required: true },
        avatar: { type: String, required: true },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  {
    collation: { locale: 'en', strength: 2 },
  }
);
const Post = mongoose.model('post', PostSchema);
module.exports = Post;
