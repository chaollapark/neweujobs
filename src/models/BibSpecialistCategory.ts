import mongoose from 'mongoose';

const BibSpecialistCategorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['sector', 'service'],
  },
  description: { type: String },
  originalDescription: { type: String },
  consultancies: [{ type: String }],
  lawFirms: [{ type: String }],
  sourceUrl: { type: String },
}, {
  timestamps: true,
  collection: 'bib_specialist_categories',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

export default mongoose.models.BibSpecialistCategory || mongoose.model('BibSpecialistCategory', BibSpecialistCategorySchema);
