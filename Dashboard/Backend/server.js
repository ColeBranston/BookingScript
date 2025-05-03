const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { createEntry, deleteEntry, getAllEntries } = require('./DB/Entries/entries_functions');
require('dotenv').config();

const connectDB = require('./DB/db');
connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// Log every request
app.use((req, res, next) => {
  console.log('Time:', new Date().toISOString(), req.method, req.url);
  next();
});

// --- Utility JWT Generators ---
const generateAccessToken = (username) =>
  jwt.sign({ username }, process.env.JWT_SECRET || 'jwtSecret', { expiresIn: '1m' });

const generateRefreshToken = (username) =>
  jwt.sign({ username }, process.env.JWT_SECRET || 'jwtSecret', { expiresIn: '10m' });

// --- Login Route ---
app.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).send('Password required');
  }

  if (password === process.env.password) {
    const username = 'admin'; // fixed user identifier
    const accessToken = generateAccessToken(username);
    const refreshToken = generateRefreshToken(username);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
      path: '/',          // ← make it available on every route
      maxAge: 10 * 60 * 1000
    });    

    return res.json({ accessToken });
  } else {
    return res.status(401).send('Unauthorized');
  }
});

// --- Refresh Token Route ---
app.post('/refresh-token', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'jwtSecret', (err, decoded) => {
    if (err) return res.status(403).send('Invalid Refresh Token');

    const newAccessToken = generateAccessToken(decoded.username);
    res.json({ accessToken: newAccessToken });
  });
});

// --- Middleware to Protect Routes ---
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Access token required');

  jwt.verify(token, process.env.JWT_SECRET || 'jwtSecret', (err, decoded) => {
    if (err) return res.status(403).json({ auth: false, message: 'Token invalid or expired' });

    req.userID = decoded.username;
    next();
  });
};

// --- Protected Route ---
app.get('/isUserAuth', verifyJWT, (req, res) => {
  res.send(`Hey ${req.userID}, you are authenticated`);
});

// --- Entry API Routes ---
app.post('/api/create/entry', async (req, res) => {
  const { Room, Date, Time } = req.body;
  try {
    const response = await createEntry(Room, Date, Time);
    if (response === 201) {
      res.status(201).json({ message: 'Entry Created Successfully' });
    } else {
      res.status(400).json({ message: 'Failed to create entry' });
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).send('An error occurred while creating the entry');
  }
});

app.delete('/api/delete/entry', async (req, res) => {
  const { Time } = req.body;
  try {
    const response = await deleteEntry(Time);
    if (response) {
      res.status(200).send('Entry deleted successfully');
    } else {
      res.status(404).send('Entry not found');
    }
  } catch (error) {
    console.error('Error deleting entry:', error);
    res.status(500).send('An error occurred while deleting the entry');
  }
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await getAllEntries();
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).send('An error occurred while fetching entries');
  }
});

app.get('/api/test', (req, res) => {
  res.status(200).send('Endpoint Accessed');
});

app.get('/', (req, res) => res.send('Express on Vercel'));

// --- Start Server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));
