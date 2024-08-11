import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CListGroup,
  CListGroupItem,
  CButton,
  CBadge,
  CFormSelect, // Import the CFormSelect component
} from '@coreui/react';
import axios from 'axios'; // Import axios for making API calls

const CourseDetails = () => {
  // Fake course data
  const course = {
    courseId: 'CSE101',
    courseName: 'Introduction to Computer Science',
    instructor: 'Dr. Alice Smith',
    duration: '6 Months',
    startDate: '2024-09-01',
    description: 'An introductory course in computer science focusing on basic concepts and programming skills.',
  };

  // Fake document data
  const [documents, setDocuments] = useState([
    { name: 'Syllabus', uploaded: false, file: null },
    { name: 'Assignment 1', uploaded: false, file: null },
    { name: 'Project Report', uploaded: false, file: null },
  ]);

  // State for selected applicant
  const [selectedApplicant, setSelectedApplicant] = useState('');

  const handleFileUpload = (index, event) => {
    const newDocuments = [...documents];
    newDocuments[index].file = event.target.files[0];
    newDocuments[index].uploaded = false; // Set uploaded to false until the file is actually uploaded
    setDocuments(newDocuments);
  };

  // Function to handle applicant assignment
  const handleAssignApplicant = () => {
    if (selectedApplicant) {
      alert(`Applicant ${selectedApplicant} has been assigned to the course.`);
      // Here you could also send this data to your backend or perform other actions
    } else {
      alert('Please select an applicant before assigning.');
    }
  };

  // Function to handle file upload to the server
  const handleUploadClick = async (index) => {
    const file = documents[index].file;

    if (!file) {
      alert('No file selected for upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Replace with your API endpoint
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update document status and handle response as needed
      const newDocuments = [...documents];
      newDocuments[index].uploaded = true;
      setDocuments(newDocuments);

      alert(`File uploaded successfully: ${response.data.message}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <h2>Course Details</h2>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Course ID:</strong> {course.courseId}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Course Name:</strong> {course.courseName}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Instructor:</strong> {course.instructor}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Duration:</strong> {course.duration}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Start Date:</strong> {course.startDate}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Description:</strong> {course.description}
                </CListGroupItem>
              </CListGroup>

              {/* Applicant Selection */}
              <h4 className="mt-4">Assign Applicant</h4>
              <CRow>
                <CCol md={8}>
                  <CFormSelect
                    value={selectedApplicant}
                    onChange={(e) => setSelectedApplicant(e.target.value)}
                  >
                    <option value="" disabled>Select an Applicant</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Jane Smith">Jane Smith</option>
                    <option value="Alice Johnson">Alice Johnson</option>
                  </CFormSelect>
                </CCol>
                <CCol md={4}>
                  <CButton color="primary" onClick={handleAssignApplicant}>
                    Assign
                  </CButton>
                </CCol>
              </CRow>

              <h4 className="mt-4">Documents</h4>
              <CListGroup flush>
                {documents.map((doc, index) => (
                  <CListGroupItem key={index}>
                    <strong>{doc.name}:</strong>{' '}
                    {doc.uploaded ? (
                      <CBadge color="success">Uploaded</CBadge>
                    ) : (
                      <CBadge color="warning">Not Uploaded</CBadge>
                    )}
                    <div className="mt-2">
                      {doc.uploaded ? (
                        <div>
                          <strong>File:</strong> {doc.file.name}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(index, e)}
                          />
                          <CButton
                            color="primary"
                            onClick={() => handleUploadClick(index)}
                            className="ms-2"
                          >
                            Upload
                          </CButton>
                        </div>
                      )}
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default CourseDetails;
