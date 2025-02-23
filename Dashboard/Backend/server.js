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

app.post("/api/login", (req, res) => {
    const {password} = req.body
    console.log(req.body)
    if (password == "Sonic888!") {
        res.status(200).send("Successful Login")
    } else {
        res.status(500).send("Wrong Password")
    }
})

// Listening for when a user connects to the API
app.listen(4000, () => console.log('Listening on port 4000.'));