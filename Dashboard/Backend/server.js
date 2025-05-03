const express = require('express'); // Initialization
const cors = require('cors'); // Adding CORS
const jwt = require('jsonwebtoken');
const { createEntry, deleteEntry, getAllEntries } = require('./DB/Entries/entries_functions');
const cookieParser = require('cookie-parser');

require('dotenv').config(); // Load environment variables

const connectDB = require('./DB/db'); // Database connection function
connectDB();

const app = express(); // Initialization


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser()); // ✅ this will now parse cookies correctly


// Middleware to parse JSON bodies
app.use(express.json());

// Middleware Function called every time a request occurs
app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next(); // Directs the program to the next middleware function or to the rest of the code
});

// DEPRECATED // Route to handle login requests
// app.post('/api/login', (req, res) => {
//   const { password } = req.body;
//   console.log(req.body);
//   if (password == process.env.password) { // Use strict equality for comparison
//     res.status(200).send('Successful Login');
//   } else {
//     res.status(401).send('Wrong Password'); // Use 401 status code for unauthorized access
//   }
// });

// Route to create a new entry
app.post('/api/create/entry', async (req, res) => { // Add async keyword
  const { Room, Date, Time } = req.body;
  try {
    const response = await createEntry(Room, Date, Time); // Use await inside async function

    if (response === 201) { // Use strict equality for comparison
      res.status(201).json({ message: 'Entry Created Successfully' }); // No need for .send() after .json()
    } else {
      console.log(response);
      res.status(400).json({ message: 'Failed to create entry' }); // Use appropriate status code for errors
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).send('An error occurred while creating the entry');
  }
});

// Route to delete an entry
app.delete('/api/delete/entry', async (req, res) => {
  const { Time } = req.body; // Assume you're sending the time in the request body
  try {
    const response = await deleteEntry(Time);
    if (response) {
      res.status(200).send('Entry deleted successfully');
    } else {
      res.status(404).send('Entry not found'); // Use 404 for not found
    }
  } catch (error) {
    console.error('Error deleting entry:', error); // Add console log for debugging
    res.status(500).send('An error occurred while deleting the entry');
  }
});

// Route to fetch all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await getAllEntries();
    res.status(200).json(entries); // Send entries as JSON response
  } catch (error) {
    console.error('Error fetching entries:', error); // Add console log for debugging
    res.status(500).send('An error occurred while fetching entries');
  }
});

// Test endpoint for debugging or basic connectivity
app.get('/api/test', (req, res) => {
  res.status(200).send('Endpoint Accessed');
});

app.get("/", (req, res) => res.send("Express on Vercel"));

// __________________________For JWT Security___________________________________

let users = [];

const generateRefreshToken = (username) => {
    return jwt.sign({ username }, 'jwtSecret', { expiresIn: '10m' });
}

const generateAccessToken = (username) => {
    return jwt.sign({ username }, 'jwtSecret', { expiresIn: '1m' });
}

// app.post('/register', (req, res) => {
//     const { username, password } = req.body;
//     if (!username || !password) {
//         return res.status(400).send('Invalid Credentials!'); 
//     }
//     users.push([username, password]);
//     res.send('Your data was appended');
// });

app.post('/login', (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).send('Invalid Credentials!');
    }
    if (password == process.env.password) {
        const accessToken = generateAccessToken(password);
        const refreshToken = generateRefreshToken(password);
        // Assuming `res` is the response object from Express.js
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'None', // Adjust based on your cross-origin requirements
            secure: true, // Set to true for HTTPS
            maxAge: 1000 * 60 * 10 // 10 minutes
        });
        res.json({ accessToken });
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.post('/refresh-token', (req, res) => {
    const refreshToken = req.cookies.refreshToken; // Extract token from HttpOnly cookie
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
  
    jwt.verify(refreshToken, 'jwtSecret', (err, user) => {
      if (err) return res.status(403).send("Invalid Refresh Token");
  
      const newAccessToken = generateAccessToken(user.username);
      res.json({ accessToken: newAccessToken });
    });
  });

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token part from "Bearer <token>"
  
    if (!token) {
        return res.status(401).send("Token is required");
    }
    jwt.verify(token, 'jwtSecret', (err, decoded) => {
        if (err) {
            return res.status(403).json({ auth: false, message: "Authorization failed" });
        }
        req.userID = decoded.username;
        next();
    });
};

app.get('/isUserAuth', verifyJWT, (req, res) => {
    res.send("Hey you are authenticated");
});

// For local development only: Uncomment this block to enable local server

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));


// // Export the app instead of listening directly for deployment environments
// module.exports = app;