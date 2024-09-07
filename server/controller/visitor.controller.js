const cloudinary = require("../config/cloudinary");
const Employee = require("../model/Employee.model");
const Notification = require("../model/Notification.model");
const Student = require("../model/Student.model");
const Visitor = require("../model/Visitor.model");
const { addVisitor, getAllVisitors, getAVisitorById } = require("../services/visitor.service");

exports.addVisitorController = async (req, res) => {
  try {
    console.log("stu", req.body);
    console.log("stu", req.files['nidOrBirthCertificate'][0].path);
    const { name, email, phone, interestedCountries, targetedIntake } = req.body;
    const nidOrBirthCertificateUpload = await cloudinary.uploader.upload(req.files['nidOrBirthCertificate'][0].path, {
      folder: 'visitor/nidOrBirthCertificate',
    });


    const newVisitor = await addVisitor({
      name,
      email,
      phone,
      interestedCountries,
      targetedIntake,
      nidOrBirthCertificate: nidOrBirthCertificateUpload.secure_url,
    });
    

    res.status(200).json({
      status: 'success',
      message: 'Visitor Registration completed successfully',
      data: newVisitor,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllVisitorsController = async (req, res) => {
  try {
    const visitors = await getAllVisitors();
    res.status(200).json(visitors);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAVisitorController = async (req, res) => {
  try {
    console.log("hitttttttttttttt")
    const visitor = await getAVisitorById(req.params.visitorId);
    res.status(200).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.convertVisitorToStudent = async (req, res) => {
  const session = await Student.startSession(); // Start a session for transaction
  session.startTransaction(); // Start transaction
  try {
    const { visitorId } = req.params;
    const { parentPhone, dob, address, counselor } = req.body;

    // Find the visitor by ID
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // Prepare student data for creation
    const studentData = {
      fullName: visitor.name,
      email: visitor.email,
      phoneNumber: visitor.phone,
      parentPhone,
      dob,
      address,
      employees: {
        asCounselor: [counselor], // Assign the selected counselor
      },
    };

    // Create a new student using the studentData
    const newStudent = new Student(studentData);
    await newStudent.save({ session }); // Save the student within the session

    // Update the employee document to add the new student to the counselor's list
    if (counselor) {
      await Employee.findByIdAndUpdate(
        counselor,
        { $addToSet: { "students.asCounselor": newStudent._id } },
        { session } // Ensure this update is part of the transaction
      );
    }

    // Commit the transaction after successful student creation and employee update
    await session.commitTransaction();
    session.endSession();

    // After creating the student, create a notification for the assigned counselor
    const notification = new Notification({
      message: `A new student has been assigned to you for counseling: ${newStudent.fullName}`,
      employeeId: newStudent.employees.asCounselor[0],
      studentId: newStudent._id,
      for: "counseling",
    });
    await notification.save();

    // Emit the notification using Socket.io
    const io = req.app.get("socketio");
    io.emit("notification", notification);

    // Remove the visitor after converting to a student
    await Visitor.findByIdAndDelete(visitorId);

    res.status(201).json({ message: 'Visitor converted to student successfully', student: newStudent });
  } catch (error) {
    // Only abort if the transaction has not been committed yet
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    console.error('Error converting visitor to student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

