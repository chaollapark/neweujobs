import mongoose from 'mongoose';

const BibEditorialPageSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: { type: String, required: true },
  section: { type: String },
  content: { type: String },
  originalContent: { type: String },
  parentSlug: { type: String },
  sortOrder: { type: Number, default: 0 },
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_editorial_pages',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibEditorialPage || mongoose.model('BibEditorialPage', BibEditorialPageSchema);
