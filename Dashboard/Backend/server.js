const express = require('express'); // Initialization
const cors = require('cors'); // Adding CORS
const { createEntry, deleteEntry, getAllEntries } = require('./DB/Entries/entries_functions');
const connectDB = require('./DB/db'); // Database connection function
connectDB();

require('dotenv').config(); // Load environment variables

const app = express(); // Initialization

const corsOptions = {
  origin: [
    'https://booking-script-frontend-fsdcymn20-colebranstons-projects.vercel.app', // Deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // HTTP methods allowed
  credentials: true, // Allow cookies or auth headers if needed
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight OPTIONS requests



// Middleware to parse JSON bodies
app.use(express.json());

// Middleware Function called every time a request occurs
app.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next(); // Directs the program to the next middleware function or to the rest of the code
});

// Route to handle login requests
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  console.log(req.body);
  if (password === process.env.password) { // Use strict equality for comparison
    res.status(200).send('Successful Login');
  } else {
    res.status(401).send('Wrong Password'); // Use 401 status code for unauthorized access
  }
});

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

// Export the app instead of listening directly for deployment environments
module.exports = app;

// For local development only: Uncomment this block to enable local server

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Listening on port ${PORT}.`));

