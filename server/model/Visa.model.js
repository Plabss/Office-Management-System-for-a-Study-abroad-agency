// models/Course.js
const mongoose = require("mongoose");

const visaSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    course: {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      courseName: { type: String, required: true },
      courseUniversity: { type: String, required: true}
    },
    applied: {
      type: String,
      required: true,
    },
    student: {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      studentName: { type: String, required: true },
    },
    visaAdmin: {
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

const Visa = mongoose.model("Visa", visaSchema);

module.exports = Visa;
