import mongoose from 'mongoose';

const LobbyingEntitySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Please provide a slug for the entity.'],
    unique: true,
    index: true,
  },
  name: {
    type: String,
  },
  originalName: { type: String },
  description: { type: String },
  goals: { type: String },
  website: { type: String },
  webSiteURL: { type: String },
  interests: [{ type: String }],
  levelsOfInterest: [{ type: String }],
  interestRepresented: { type: String },
  registrationCategory: { type: String },
  acronym: String,
  identificationCode: String,
  EPAccreditedNumber: mongoose.Schema.Types.Mixed,
  EULegislativeProposals: String,
  EUOffice: mongoose.Schema.Types.Mixed,
  EUSupportedForumsAndPlatforms: String,
  communicationActivities: String,
  entityForm: String,
  financialData: mongoose.Schema.Types.Mixed,
  headOffice: mongoose.Schema.Types.Mixed,
  interOrUnofficalGroupings: String,
  lastUpdateDate: Date,
  members: mongoose.Schema.Types.Mixed,
  rawXML: String,
  registrationDate: Date,
  structure: mongoose.Schema.Types.Mixed,
  structureType: String,
  isMemberOf: String,
  organisationMembers: String,
}, {
  timestamps: true,
  collection: 'eu_interest_representatives',
  strict: false,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Ensure 'name' always has a value — fall back to originalName then slug
LobbyingEntitySchema.pre('find', function () {
  // After query, we'll handle in post
});

LobbyingEntitySchema.post('find', function (docs: any[]) {
  for (const doc of docs) {
    if (!doc.name && doc.originalName) {
      doc.name = doc.originalName;
    }
  }
});

LobbyingEntitySchema.post('findOne', function (doc: any) {
  if (doc && !doc.name && doc.originalName) {
    doc.name = doc.originalName;
  }
});

export default mongoose.models.LobbyingEntity || mongoose.model('LobbyingEntity', LobbyingEntitySchema);
