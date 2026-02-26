import mongoose from 'mongoose';

const OrgCareerGuideSchema = new mongoose.Schema({
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
  contentHtml: {
    type: String,
    required: [true, 'Please provide content HTML.'],
  },
  organization: {
    type: String,
    required: [true, 'Please provide an organization name.'],
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
  },
  entitySlug: {
    type: String,
    index: true,
  },
  wordCount: { type: Number },
  generatedAt: { type: Date },
  description: { type: String },
}, {
  timestamps: true,
  collection: 'org_career_guides',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.OrgCareerGuide || mongoose.model('OrgCareerGuide', OrgCareerGuideSchema);
