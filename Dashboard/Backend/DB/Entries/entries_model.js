const mongoose = require('mongoose')

// Creating the User Schema with Email, Username, Password, and ClientID

const entrySchema = new mongoose.Schema({
    Room: String,
    Date: String,
    Time: String
})


// Taking the schema and assigning it to a model for Mongo to recognize
const Entry = mongoose.model("Entry", entrySchema)

module.exports = Entry