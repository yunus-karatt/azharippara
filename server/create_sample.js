import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Family from './models/Family.js';
import Member from './models/Member.js';

dotenv.config();

const seedSampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // Clear existing sample data if any (optional, but keep it clean)
    await Family.deleteMany({ houseName: 'Green Valley' });

    // 1. Create a Family
    const family = await Family.create({
      houseName: 'Green Valley',
      houseNumber: '112',
      village: 'Kondotty',
      wardNumber: '12',
      address: 'Green Valley House, Near Masjid, Kondotty, Kerala',
      contactNumber: '9446001122',
      houseHolderOnlyName: 'Abdullah K',
    });

    console.log('Sample Family created: Green Valley');

    // 2. Add Members
    const members = [
      {
        familyId: family._id,
        name: 'Abdullah K',
        age: 48,
        sex: 'Male',
        maritalStatus: 'Married',
        bloodGroup: 'B+',
        education: 'B.Ed, MA',
        job: 'Teacher',
        madrasaEducation: 'Dars',
        relationToHouseHolder: 'Self',
        financial: { loans: 'Home Loan (SBI)', rationCard: 'APL' },
        ids: { aadhar: '1234 5678 9012', phone: '9446001122' },
        health: { status: 'Satisfied' }
      },
      {
        familyId: family._id,
        name: 'Fatima',
        age: 42,
        sex: 'Female',
        maritalStatus: 'Married',
        bloodGroup: 'O+',
        education: 'SSLC',
        job: 'Home Maker',
        madrasaEducation: 'Primary',
        relationToHouseHolder: 'Wife',
        financial: { loans: 'None', rationCard: 'APL' },
        ids: { aadhar: '1234 5678 9013', phone: '9446001123' },
        health: { status: 'Satisfied' }
      },
      {
        familyId: family._id,
        name: 'Hassan',
        age: 12,
        sex: 'Male',
        maritalStatus: 'Unmarried',
        bloodGroup: 'B+',
        education: '7th Std',
        job: 'Student',
        madrasaEducation: '5th Std',
        relationToHouseHolder: 'Son',
        financial: { loans: 'None', rationCard: 'APL' },
        ids: { aadhar: '1234 5678 9014', phone: 'None' },
        health: { status: 'Satisfied' }
      },
      {
        familyId: family._id,
        name: 'Zainab',
        age: 65,
        sex: 'Female',
        maritalStatus: 'Widowed',
        bloodGroup: 'A+',
        education: 'None',
        job: 'None',
        madrasaEducation: 'Basic',
        relationToHouseHolder: 'Mother',
        financial: { loans: 'None', rationCard: 'APL' },
        ids: { aadhar: '1234 5678 9015', phone: 'None' },
        health: { status: 'Kidney Disease', details: 'Dialysis twice a week' }
      }
    ];

    await Member.insertMany(members);
    console.log('4 Sample Members added to Green Valley');

    console.log('Data creation complete!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedSampleData();
