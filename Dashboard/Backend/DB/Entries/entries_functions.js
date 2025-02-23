const Entry = require('./entries_model');

const createEntry = async (room, date, time) => {
    try {
        const newEntry = new Entry({
            Room: room,
            Date: date,
            Time: time
        });

        await newEntry.save();

        console.log("Setting Status: 201");

        return 201;
    } catch (e) {
        console.log("Error creating entry with error:", e);
    }
};

const deleteEntry = async (time) => {
    try {
        const deletedEntry = await Entry.findOneAndDelete({ Time: time }); // Use await here
        if (deletedEntry) {
            console.log("Entry at time:", time, "has been deleted");
            return deletedEntry;
        } else {
            console.log("No entry found at time:", time);
            return null;
        }
    } catch (e) {
        console.log("Error deleting entry with error:", e);
        return null;
    }
};

// Add the new function to get all entries
const getAllEntries = async () => {
    try {
        const entries = await Entry.find();
        return entries;
    } catch (e) {
        console.log("Error getting entries:", e);
        return [];
    }
};

module.exports = { createEntry, deleteEntry, getAllEntries };
