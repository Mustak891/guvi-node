import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { usersRouter } from './users.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

const ConnectionDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MongoDB_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('MongoDB connected')
    } catch (err) {
        console.log(err)
    }
}
await ConnectionDB();

app.use(cors({ origin: ['https://guvi-jobtask.netlify.app', 'http://localhost:3000'], credentials: true, }));

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.use('/api', usersRouter);

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });