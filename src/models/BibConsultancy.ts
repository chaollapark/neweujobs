import mongoose from 'mongoose';

const BibConsultancySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true },
  logoUrl: { type: String },
  description: { type: String },
  originalDescription: { type: String },
  ownership: { type: String },
  brusselsOfficeSince: { type: String },
  staffCount: { type: String },
  contact: {
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
  },
  specialisms: [{ type: String }],
  linkedConsultants: [{ type: String }],
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_consultancies',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibConsultancy || mongoose.model('BibConsultancy', BibConsultancySchema);
