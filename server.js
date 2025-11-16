// server.js - The "On-Switch"

const app = require('./app'); // Import the brain

const PORT = process.env.PORT || 3000;

mongoose.connect(uri)
.then(() => console.log("✅ MongoDB Connected!"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});