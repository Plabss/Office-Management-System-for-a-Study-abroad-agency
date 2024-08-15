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
exports.assignApplicant = async (courseId,studentId,applicantId) => {
  try {
    const course = await Course.findByIdAndUpdate(courseId,{
      applicantId: applicantId
    });


    const student = await Student.findByIdAndUpdate(studentId,
      { $push: { "employees.asApplicant": applicantId } }
    );

    

    return {course:course, student:student}
  } catch (error) {
    throw new Error('Error fetching employees: ' + error.message);
  }
};
