import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoute from './routes/auth.js';
import collectRoute from './routes/collections.js';
const app = express();
dotenv.config();

const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use('/api/auth', authRoute);
app.use('/api/collections', collectRoute);

const startApp = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(DB_URL as string);
    app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};
startApp();
