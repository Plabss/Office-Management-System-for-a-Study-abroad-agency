const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: [{ type: String, required: true }],  
  cv: { type: String, required: true }, 
  nid: { type: String, required: true },  
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
