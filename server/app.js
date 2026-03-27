const express = require('express');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const swapRoutes = require('./routes/swapRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const adminRoutes = require('./routes/adminRoutes');
const messageRoutes = require('./routes/messageRoutes');
const dotenv = require('dotenv');
const cors=require('cors');



dotenv.config();
const app = express();

app.use(cors({
    origin: ['http://localhost:8080','https://skill-verse-vert.vercel.app'], 
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/swaps', swapRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', messageRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;