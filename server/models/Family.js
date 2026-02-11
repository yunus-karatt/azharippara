import mongoose from 'mongoose';

const familySchema = mongoose.Schema({
  houseName: { type: String, required: true },
  houseNumber: { type: String, required: true },
  village: { type: String, required: true },
  wardNumber: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String },
  houseHolderOnlyName: { type: String, required: true }, // Name of the main person
}, { timestamps: true });

const Family = mongoose.model('Family', familySchema);
export default Family;
