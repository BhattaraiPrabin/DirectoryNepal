const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware


mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/webProject", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Database Connected Successfully!!");
}).catch(err => {
  console.log('Could not connect to the database', err);
  process.exit();
});

const app = express();
const port = 8080;
const host = "localhost";

// Mongoose model for your "Directory" collection
const directorySchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  mapEmbed: String,
  websiteLink: String,
});

const Directory = mongoose.model('Directory', directorySchema);

app.use(cors()); // Use cors middleware to enable CORS
app.use(express.json());

// Routes

// Create a new directory entry
app.post("/api/directory", async (req, res) => {
  try {
    const directory = new Directory(req.body);
    await directory.save();
    res.status(201).json(directory);
    console.log("Directory added sucessfully.")
  } catch (error) {
    res.status(500).json({ error: 'Failed to create directory entry' });
  }
});

// Get all directory entries
app.get("/api/directory", async (req, res) => {
  try {
    const directories = await Directory.find();
    res.status(200).json(directories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve directory entries' });
  }
});

// Get a directory entry by ID
app.get("/api/directory/:id", async (req, res) => {
  try {
    const directory = await Directory.findById(req.params.id);
    if (!directory) {
      res.status(404).json({ error: 'Directory entry not found' });
    } else {
      res.status(200).json(directory);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve directory entry' });
  }
});

// Update a directory entry by ID
app.put("/api/directory/:id", async (req, res) => {
  try {
    const directory = await Directory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(directory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update directory entry' });
  }
});

// Delete a directory entry by ID
app.delete("/api/directory/:id", async (req, res) => {
  try {
    const directory = await Directory.findByIdAndRemove(req.params.id);
    res.status(200).json(directory);
    console.log("Directory deleted sucessfully.")
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete directory entry' });
  }
});

// Serve your front-end code (HTML and JavaScript)

// Replace this with the actual path to your front-end HTML file
app.get("/", (req, res) => {
  res.json({
    "msg": "Directory server is running."
  });
});

app.listen(port, () => {
  console.log(`Running on http://${host}:${port}`);
});





