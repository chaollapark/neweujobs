import mongoose from 'mongoose';

const BibConsultantSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true },
  title: { type: String },
  organization: { type: String },
  organizationSlug: { type: String },
  email: { type: String },
  photoUrl: { type: String },
  myJob: { type: String },
  originalMyJob: { type: String },
  experience: [{ type: String }],
  specialisms: [{ type: String }],
  achievements: { type: String },
  originalAchievements: { type: String },
  education: [{ type: String }],
  languages: [{ type: String }],
  interests: { type: String },
  originalInterests: { type: String },
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_consultants',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibConsultant || mongoose.model('BibConsultant', BibConsultantSchema);
