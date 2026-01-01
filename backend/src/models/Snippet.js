const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  lang: { type: String, index: true },
  tags: [{ type: String, index: true }],
  code: { type: String },
  avgRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

SnippetSchema.index({ title: 'text', description: 'text', tags: 'text', code: 'text' }, { weights: { title: 5, description: 2, tags: 3, code: 1 } });

module.exports = mongoose.model('Snippet', SnippetSchema);
