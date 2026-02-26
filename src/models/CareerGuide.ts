import mongoose from 'mongoose';

const CareerGuideSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Please provide a slug for the career guide.'],
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  content: { type: String },
  contentHtml: { type: String },
  description: { type: String },
  excerpt: { type: String },
  author: { type: String, default: 'EU Jobs Team' },
  publishedDate: { type: Date },
  relatedInterests: [{ type: String }],
  tags: [{ type: String }],
  featuredImage: { type: String },
}, {
  timestamps: true,
  collection: 'career_guides',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.CareerGuide || mongoose.model('CareerGuide', CareerGuideSchema);
