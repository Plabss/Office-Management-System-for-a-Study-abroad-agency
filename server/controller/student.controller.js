const { createStudent,getAllStudentsByEmployeeID,getAStudent, uploadDocument } = require("../services/student.service");
const cloudinary = require('../config/cloudinary');

exports.addStudentController = async (req, res) => {
  try {
    console.log("stu",req.body)
    const student = await createStudent(req.body);
    res.status(201).json({
      status: 'success',
      student,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getAllStudentsController = async (req, res) => {
  const { employeeID } = req.params;
  try {
    const students = await getAllStudentsByEmployeeID(employeeID);
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};
exports.getAStudentController = async (req, res) => {
  const { studentID } = req.params;
  try {
    const student = await getAStudent(studentID);
    res.status(200).json(student);
    console.log(studentID)
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Failed to fetch student' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    console.log("hittttttttttttttttttt")
    const { studentId } = req.params;
    const { documentName } = req.body;
    console.log("xxxxxxxxxxxxxxxx",studentId) ;


    const fileUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: `students/${documentName}`,
    });



    const uploadedDocument= await uploadDocument(studentId, documentName, fileUpload.secure_url)    

    res.status(200).json({
      status: 'success',
      message: 'Document upload completed successfully',
      data: uploadedDocument,
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};