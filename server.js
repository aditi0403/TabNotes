// server.js

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tabnotes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(express.json());

// Define a schema for your notes
const noteSchema = new mongoose.Schema({
  libraryIndex: Number,
  moduleIndex: Number,
  note: String,
});

// Create a model for the notes collection
const Note = mongoose.model('Note', noteSchema);

// Create a route to save a note
app.post('/notes', async (req, res) => {
  const { libraryIndex, moduleIndex, note } = req.body; // Assuming the request body contains these fields
  const newNote = new Note({ libraryIndex, moduleIndex, note });
  try {
    const savedNote = await newNote.save();
    res.json(savedNote); // Sending the saved note back as a response
  } catch (error) {
    res.status(500).send('Error saving the note'); // Handling the error if the save operation fails
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});