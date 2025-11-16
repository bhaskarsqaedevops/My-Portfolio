const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const bcrypt = require('bcryptjs');

// Pre-save hook: Run this before saving to the DB
userSchema.pre('save', async function(next) {
  //  Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a "salt" (random data to make the hash unique)
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);