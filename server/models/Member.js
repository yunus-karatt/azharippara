import mongoose from 'mongoose';

const memberSchema = mongoose.Schema({
  familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  maritalStatus: { type: String, enum: ['Married', 'Unmarried', 'Divorced', 'Widowed'], required: true },
  bloodGroup: { type: String },
  education: { type: String },
  job: { type: String },
  madrasaEducation: { type: String },
  relationToHouseHolder: { type: String, required: true },
  financial: {
    loans: { type: String }, // Description of loans or 'None'
    rationCard: { type: String, enum: ['APL', 'BPL', 'None'], default: 'None' },
  },
  ids: {
    aadhar: { type: String },
    phone: { type: String },
  },
  health: {
    status: { type: String, enum: ['Satisfied', 'Cancer', 'Kidney Disease', 'Mental', 'Other'], default: 'Satisfied' },
    details: { type: String }, // For 'Other'
  },
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);
export default Member;
