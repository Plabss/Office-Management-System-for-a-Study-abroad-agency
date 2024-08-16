const Course = require('../model/Course.model');
const Employee = require('../model/Employee.model');
const Student = require('../model/Student.model');

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
