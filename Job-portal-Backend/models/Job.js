const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  position: String,
  ctc: String,
  openings:Number,
  availableOpenings: Number,
  department: String,
  technologies: [String],
  location: String,
});

module.exports = mongoose.model('Job', jobSchema);
