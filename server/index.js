import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import familyRoutes from './routes/familyRoutes.js';
import memberRoutes from './routes/memberRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173',
  'https://azharippara.vercel.app', // Adding your Vercel URL explicitly as a fallback
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [])
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/families', familyRoutes);
app.use('/api/members', memberRoutes);

app.get('/', (req, res) => {
  res.send('Mahallu Management API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
