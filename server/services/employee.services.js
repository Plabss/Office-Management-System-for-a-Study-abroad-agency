const Course = require('../model/Course.model');
const Employee = require('../model/Employee.model');
const Student = require('../model/Student.model');
const Visa = require('../model/Visa.model');

exports.addEmployee = async (employeeData) => {
  employeeData.role = [employeeData.role];
  const newEmployee = new Employee(employeeData);
  return await newEmployee.save();
};
exports.getAllEmployees = async () => {
  try {
    const employees = await Employee.find(); // Fetch all employees
    return employees;
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};
exports.getEmployeeById = async (id) => {
  try {
    const employee = await Employee.findById(id).populate('students.asCounselor students.asApplicant students.asVisaAdmin');
    return employee;
  } catch (error) {
    
  }
};
exports.assignApplicant = async (courseId,studentId,applicantId,applicantName) => {
  try {
    const course = await Course.findByIdAndUpdate(courseId,{
      ['applicant.name']: applicantName,
      ['applicant._id']: applicantId,
    });


    const student = await Student.findByIdAndUpdate(studentId,
      { $addToSet: { "employees.asApplicant": applicantId} }
    );

    const employee = await Employee.findByIdAndUpdate(applicantId,
      { $addToSet: { "students.asApplicant":  studentId} }
    );

    return {course:course, student:student, employee:employee}
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};
exports.assignVisaAdmin = async (studentId,visaId,visaAdminId,visaAdminName) => {
  try {
    const visa = await Visa.findByIdAndUpdate(visaId,{
      ['visaAdmin.name']: visaAdminName,
      ['visaAdmin._id']: visaAdminId,
    });


    const student = await Student.findByIdAndUpdate(studentId,
      { $addToSet: { "employees.asVisaAdmin": visaAdminId} }
    );

    const employee = await Employee.findByIdAndUpdate(visaAdminId,
      { $addToSet: { "students.asVisaAdmin":  studentId} }
    );

    return {visa:visa, student:student, employee:employee}
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};
exports.updateRole = async (employeeId, role, action) => {
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      throw new Error('Employee not found');
    }

    if (action === 'add') {
      // Add the role if it does not exist already
      if (!employee.role.includes(role)) {
        employee.role.push(role);
      } else {
        throw new Error('Role already exists');
      }
    } else if (action === 'remove') {
      // Prevent removal if it's the only role
      if (employee.role.length === 1) {
        throw new Error('Cannot remove the only role');
      }
      
      // Remove the role if it exists
      if (employee.role.includes(role)) {
        employee.role = employee.role.filter(r => r !== role);
      } else {
        throw new Error('Role does not exist');
      }
    } else {
      throw new Error('Invalid action');
    }

    await employee.save();
    return employee;
  } catch (error) {
    throw new Error('Error updating role: ' + error.message);
  }
};
