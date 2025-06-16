import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  author: {
    address: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    balance: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  moderated: {
    type: Boolean,
    default: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

// Ensure one post per day per user
PostSchema.index({ 'author.address': 1, createdAt: 1 }, { unique: true });

export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema); 