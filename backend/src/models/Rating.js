const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  snippetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Snippet', required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

RatingSchema.index({ userId: 1, snippetId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', RatingSchema);
