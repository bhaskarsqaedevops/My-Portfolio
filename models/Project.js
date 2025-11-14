const mongoose = require('mongoose');

// 1. The Blurprint (Schema)
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tech: { type: String, required: true },
  // MongoDB adds a unique ID automatically, so we don't need to define 'id'
});

// 2. The Model (The tool using here to interact with the DB)
const Project = mongoose.model('Project', projectSchema);

// 3. Export it so server.js can use it
module.exports = Project;