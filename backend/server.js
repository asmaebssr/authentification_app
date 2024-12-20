const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB  = require('./config/db');
const router = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));

const port = process.env.PORT || 5000;

app.use(express.json()) // allows us to parse incomming requests : req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use('/api/auth', router)

app.listen(port, () => {
    connectDB()
    console.log('Server is running on port', port)
});