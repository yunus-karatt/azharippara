import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const exists = await User.findOne({ email: 'admin@mahallu.com' });
    if (exists) {
      console.log('Admin already exists');
      process.exit();
    }

    await User.create({
      name: 'Admin',
      email: 'admin@mahallu.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created: admin@mahallu.com / admin123');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
