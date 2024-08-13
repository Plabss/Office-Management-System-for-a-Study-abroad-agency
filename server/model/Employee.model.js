const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: [{ type: String, required: true }],  // Array of roles
  cv: { type: String, required: true },  // Cloudinary URL
  nid: { type: String, required: true },  // Cloudinary URL
  students: {
    asCounselor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    asApplicant: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    asVisaAdmin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  }
}, {
  timestamps: true,
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
