const mongoose = require("mongoose");

// Subdocument schema for discussions
const discussionSchema = new mongoose.Schema({
  employee_name: { type: String, required: true }, // Employee name involved in the discussion
  message: { type: String, required: true },       // Message from the employee
  createdAt: { type: Date, default: Date.now }     // Timestamp for when the message was created
});

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    parentPhone: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    employees: {
      asCounselor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }],
      asApplicant: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }],
      asVisaAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }],
    },
    documents: {
      cv: { type: String, default: null },
      nid: { type: String, default: null },
    },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }],
    visas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Visa", required: true }],
    progress: { type: String, default: "enrolled" },
    discussions: [discussionSchema],  // Array of discussions using the subdocument schema
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
