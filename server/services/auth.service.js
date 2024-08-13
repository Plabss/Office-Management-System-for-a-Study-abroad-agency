const Employee = require("../model/Employee.model");

exports.loginService = async (email, password) => {
  try {
    // Find the employee by email
    const employee = await Employee.findOne({ email });
    if (!employee) {
      throw new Error('Employee not found');
    }

    // Compare the provided password with the stored password
    if (password !== employee.password) {
      throw new Error('Invalid password');
    }

    return employee;
  } catch (error) {
    throw new Error(error.message);
  }
};
