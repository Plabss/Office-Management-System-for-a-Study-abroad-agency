const Employee = require("../model/Employee.model");
const Student = require("../model/Student.model");
const cloudinary = require("../config/cloudinary");

exports.createStudent = async (studentData) => {
  const session = await Student.startSession();
  session.startTransaction();
  try {
    // Create the student
    const newStudent = new Student(studentData);
    await newStudent.save({ session });

    // Update the employee document
    if (studentData.employees.asCounselor) {
      await Employee.findByIdAndUpdate(
        studentData.employees.asCounselor,
        { $push: { "students.asCounselor": newStudent._id } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(
      "Error creating student and updating employee: " + error.message
    );
  }
};
exports.getAllStudentsByEmployeeID = async (employeeID) => {
  try {
    // Find the employee and populate students based on roles
    const employee = await Employee.findById(employeeID)
      .populate({
        path: "students.asCounselor students.asApplicant students.asVisaAdmin",
      })
      .exec();
    console.log("employee", employee);
    if (!employee) {
      throw new Error("Employee not found");
    }

    // Aggregate all student lists based on roles
    const allStudents = [
      ...employee.students.asCounselor,
      ...employee.students.asApplicant,
      ...employee.students.asVisaAdmin,
    ];

    // Remove duplicates if any
    const uniqueStudents = Array.from(
      new Set(allStudents.map((s) => s._id))
    ).map((id) => allStudents.find((s) => s._id.equals(id)));

    return allStudents;
  } catch (error) {
    console.error("Error in getStudentsByEmployee service:", error);
    throw error;
  }
};
exports.getAStudent = async (studentID) => {
  try {
    const student = await Student.findById(studentID);
    return student;
  } catch (error) {
    console.error("Error in getStudentsByID service:", error);
    throw error;
  }
};

exports.uploadDocument = async (studentId, documentName, file) => {
  try {
    console.log(file);
    const student = await Student.findOneAndUpdate({"_id":studentId}, {
      [`documents.${documentName}`]: file,
    }).catch((error) => {
      // Handle error
      console.error("Error in uploadDocument service:", error);
      throw error;
    });
  } catch (error) {}
};
