import mongoose from 'mongoose';

const BibArticleSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: { type: String, required: true },
  content: { type: String },
  originalContent: { type: String },
  excerpt: { type: String },
  author: { type: String },
  publishedDate: { type: Date },
  featuredImage: { type: String },
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_articles',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibArticle || mongoose.model('BibArticle', BibArticleSchema);
