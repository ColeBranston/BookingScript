const express = require('express'); // Initialization
const cors = require('cors') //adding cors

const app = express(); // Initialization

app.use(cors())

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware Function called every time a request occurs
app.use((req, res, next) => { 
  console.log('Time: ', Date.now());
  next(); // Required, directs the program to the next middleware function or to the rest of the code
});

// Listening for when a user connects to the API
app.listen(4000, () => console.log('Listening on port 4000.'));