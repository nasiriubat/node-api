require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const mongoString = process.env.DATABASE_URL;
const PORT = process.env.PORT;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', postRoutes)
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
})