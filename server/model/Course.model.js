// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    applied: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true, // Assuming each course is associated with a student
    },
    applicant: {
      name: { type: String, default: null },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
      },
    },
    assignedBy: {
      name: { type: String, required: true },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: true,
      },
    },
    documents: {
      file1: { type: String, default: null },
      file2: { type: String, default: null },
      file3: { type: String, default: null },
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
