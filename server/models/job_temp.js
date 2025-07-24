const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  company: String,
  location: String,
  url: String,
  postedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
