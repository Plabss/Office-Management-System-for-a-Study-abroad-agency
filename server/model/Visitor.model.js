const mongoose = require('mongoose');

// Subdocument schema for discussions
const discussionSchema = new mongoose.Schema({
  employee_name: { type: String, required: true }, // Employee name involved in the discussion
  message: { type: String, required: true },       // Message from the employee
  createdAt: { type: Date, default: Date.now }     // Timestamp for when the message was created
});

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  interestedCountries: { type: String, required: true },
  targetedIntake: { type: String, required: true },
  nidOrBirthCertificate: { type: String },
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: false }],
  discussions: [discussionSchema],
}, {
  timestamps: true,
});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;
