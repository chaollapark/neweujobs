import mongoose from 'mongoose';

const BibDigitalToolSchema = new mongoose.Schema({
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
  services: [{ type: String }],
  contact: {
    address: { type: String },
    phone: { type: String },
    email: { type: String },
    website: { type: String },
  },
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_digital_tools',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibDigitalTool || mongoose.model('BibDigitalTool', BibDigitalToolSchema);
