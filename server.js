const Project = require('./models/Project'); // Import the model

// 1. Import Express
const express = require('express');
const cors = require('cors'); // Import CORS
const mongoose = require('mongoose'); // Import Mongoose
const app = express();

app.use(cors()); // Tell Express to use it.
app.use(express.json()); // Allow us to read JSON data sent from frontend

// Connection String
const uri = "mongodb+srv://humanrevolutionone_db_user:nCLrzV6Yb2wgT7ot@portfoliodb.wgszoyb.mongodb.net/?appName=PortfolioDB";

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

// 3. Start the Server
const PORT = 3000;
// A new route that sends JSON data
app.get('/api/projects', (req, res) => {

  // Instead of .send (text), we use .json (data)
  res.json(projects);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});