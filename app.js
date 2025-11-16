require('dotenv').config();

const auth = require('./middleware/authMiddleware');
const Project = require('./models/Project'); 
const path = require('path');
const express = require('express');
const cors = require('cors'); 
const mongoose = require('mongoose'); 
const app = express();

app.use(cors()); 
app.use(express.json()); 
app.use(express.static(__dirname));

const uri = process.env.MONGO_URI;



/* --- ROUTES --- */

const authRoutes = require('./routes/auth'); // Import the file
app.use('/api/auth', authRoutes); //Use it!

app.get('/api/seed', async (req, res) => {
  const sampleProjects = [
    { name: "Personal Portfolio", tech: "HTML/CSS" },
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

app.get('/api/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// Protect the POST route
app.post('/api/projects', auth, async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      tech: req.body.tech
    });
    const savedProject = await newProject.save();
    res.json(savedProject);
  } catch (error) {
    res.status(500).json({ error: "Failed to save project" });
  }
});

// THE DELETE ROUTE (Updated with .trim())
app.delete('/api/projects/:id', auth, async (req, res) => {
  try {
    // trim() removes any accidental spaces from the ID string
    const id = req.params.id.trim(); 

    const deletedProject = await Project.findByIdAndDelete(id);

    // Check if we actually found and deleted something
    if (!deletedProject) {
        return res.status(404).json({ error: "Project not found" });
    }

    res.json({ message: "Project deleted successfully!" });

  } catch (error) {
      console.error("Delete Error:", error); // Log the actual error to console
      res.status(500).json({ error: "Failed to delete project" });
  }
});

// Handle PUT requests to update a project
app.put('/api/projects/:id', auth, async (req, res) => {
  try {
    const { name, tech } = req.body;
    const id = req.params.id;

    // Find the project by ID and update it
    const updateProject = await Project.findByIdAndUpdate(
      id,
      { name, tech },
      { new: true } // <--- Important option!
    );

    if (!updateProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(updateProject);

  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
});
/* --- SERVER START --- */
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app; // Export the brain

