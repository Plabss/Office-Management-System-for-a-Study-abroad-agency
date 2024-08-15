// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true, // Assuming each course is associated with a student
  },
  applicantId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null,
  },
  documents: {
    file1: { type: String, default: null },
    file2: { type: String, default: null },
    file3: { type: String, default: null },
  },
}, {
  timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
