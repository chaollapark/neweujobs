import mongoose from 'mongoose';

const BibLawFirmSchema = new mongoose.Schema({
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
  specialisms: [{ type: String }],
  contact: {
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
  },
  keyPartners: [{ type: String }],
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_law_firms',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibLawFirm || mongoose.model('BibLawFirm', BibLawFirmSchema);
