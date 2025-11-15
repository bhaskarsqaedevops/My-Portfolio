require('dotenv').config();

const Project = require('./models/Project'); // Import the mode

const path = require('path');

// 1. Import Express
const express = require('express');
const cors = require('cors'); // Import CORS
const mongoose = require('mongoose'); // Import Mongoose
const app = express();

app.use(cors()); // Tell Express to use it.
app.use(express.json()); // Allow us to read JSON data sent from frontend

// Serve static files from the current directory
app.use(express.static(__dirname));

// Connection String
const uri = process.env.MONGO_URI;

// The Connection Code
mongoose.connect(uri)
.then(() => console.log("✅ MongoDB Connected!"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

// --- SEED ROUTE (Run this once to fill the database) ---
app.get('/api/seed', async (req, res) => {
  const sampleProjects = [
    { name: "personal Portfolio", tech: "HTML/CSS" },
    { name: "Tic-Tac-Toe", tech: "JavaScript" },
    { name: "Task Manager", tech: "Node.js" }
  ];

  try {
    await Project.insertMany(sampleProjects);
    res.json({ message: "✅ Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Define a "Route"
// This says: "When someone visits the home page ('/'), say hello."
app.get('/api/projects', async (req, res) => {
  // Use the Model to find ALL projects in the database
  const projects = await Project.find();
  res.json(projects);
});

// Handle POST requests to add a new project
app.post('/api/projects', async (req, res) => {
  try {
    // 1. Create a new project using the data sent from the frontend (req.body)
    const newProject = new Project({
      name: req.body.name,
      tech: req.body.tech
    });

    // 2. Save it to the database
    const savedProject = await newProject.save();

    // 3. Send the saved project back to the frontend as confirmation
    res.json(savedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to save project" });
  }
});

// 3. Start the Server
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});