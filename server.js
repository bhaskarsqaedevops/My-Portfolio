require('dotenv').config();

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

mongoose.connect(uri)
.then(() => console.log("✅ MongoDB Connected!"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

/* --- ROUTES --- */

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

app.post('/api/projects', async (req, res) => {
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
app.delete('/api/projects/:id', async (req, res) => {
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

/* --- SERVER START --- */
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});