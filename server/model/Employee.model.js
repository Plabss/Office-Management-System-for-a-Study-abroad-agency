const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    email: { type: String, required: false },
    familyPhone: { type: String, required: false },
    previousExperience: { type: String, required: false },
    password: { type: String, required: false },
    employee_id: { type: String, required: false },
    salary: { type: String, required: false },
    role: { type: String, required: false },
    profilePic: { type: String, required: false },
    cv: { type: String, required: false },
    resume: { type: String, required: false }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
