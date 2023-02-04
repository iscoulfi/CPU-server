import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import authRoute from './routes/auth.js';
import collectRoute from './routes/collections.js';
import itemRoute from './routes/items.js';
import commentRoute from './routes/comments.js';
import { createCollection, updateCollection } from './controllers/collections.js';
import { checkAuth } from './utils/checkAuth.js';
const app = express();
dotenv.config();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        cb(null, 'uploads');
    },
    filename: function (_, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });
app.post('/api/collections', checkAuth, upload.single('image'), createCollection);
app.put('/api/collections/:id', checkAuth, upload.single('image'), updateCollection);
app.use('/api/auth', authRoute);
app.use('/api/collections', collectRoute);
app.use('/api/items', itemRoute);
app.use('/api/comments', commentRoute);
const startApp = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
    }
    catch (error) {
        console.log(error);
    }
};
startApp();
//# sourceMappingURL=main.js.map