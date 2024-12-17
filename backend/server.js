const express = require('express');
const dotenv = require('dotenv');
const connectDB  = require('./config/db');
const router = require('./routes/authRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()) // allows us to parse incomming requests : req.body

app.use('/api/auth', router)

app.listen(port, () => {
    connectDB()
    console.log('Server is running on port', port)
});