const mongoose = require("mongoose");

const visaSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: false,
    },
    course: {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: false},
      courseName: { type: String, required: false },
      courseUniversity: { type: String, required: false}
    },
    student: {
      name: { type: String, required: false },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: false,
      },
    },
    visaAdmin: {
      name: { type: String, required: false },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default: null,
      },
    },
    assignedBy: {
      name: { type: String, required: false },
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        required: false,
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
