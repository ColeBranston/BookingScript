const express = require('express'); // Initialization
const cors = require('cors'); // Adding cors
const { createEntry, deleteEntry, getAllEntries } = require('./DB/Entries/entries_functions');
const connectDB = require('./DB/db');
connectDB();

require('dotenv').config()

const app = express(); // Initialization

app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware Function called every time a request occurs
app.use((req, res, next) => { 
  console.log('Time: ', Date.now());
  next(); // Required, directs the program to the next middleware function or to the rest of the code
});

app.post('/api/login', (req, res) => {
  const { password } = req.body;
  console.log(req.body);
  if (password == process.env.password) {
    res.status(200).send('Successful Login');
  } else {
    res.status(500).send('Wrong Password');
  }
});

app.post('/api/create/entry', async (req, res) => { // Add async keyword here
  const { Room, Date, Time } = req.body;
  try {
    const response = await createEntry(Room, Date, Time); // Use await inside async function

    if (response == 201) {
      res.status(201).json({ message: 'Entry Created Successfully' }).send();
    } else {
      console.log(response);
      res.status(201).json({ message: 'Failed to create entry' }).send();
    }
  } catch (error) {
    console.error('Error creating entry:', error);
    res.status(500).send('An error occurred while creating the entry');
  }
});

app.delete('/api/delete/entry', async (req, res) => { // Add async keyword here
  const { Time } = req.body; // Assume you're sending the time in the request body
  try {
    const response = await deleteEntry(Time);
    if (response) {
      res.status(200).send("Entry deleted successfully");
    } else {
      res.status(404).send("Entry not found");
    }
  } catch (error) {
    res.status(500).send("An error occurred while deleting the entry");
  }
});

// Add a new route to get all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await getAllEntries();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).send("An error occurred while fetching entries");
  }
});

// Listening for when a user connects to the API
app.listen(4000, () => console.log('Listening on port 4000.'));
