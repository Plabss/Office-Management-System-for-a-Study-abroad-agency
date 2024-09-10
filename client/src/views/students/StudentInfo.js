// StudentInfo.js
import React, { useState } from 'react';
import { CListGroup, CListGroupItem, CButton, CForm, CFormInput, CRow, CCol } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';

const StudentInfo = ({ student, setStudent, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...student });

  // Format the date in YYYY-MM-DD format for the date input
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    onSave(editedInfo); // Call the onSave function passed as a prop
    setStudent(editedInfo); // Update the student info state
    setIsEditing(false); // Exit editing mode
  };

  return (
    <CListGroup flush>
      {!isEditing ? (
        <>
          <div style={{ textAlign: 'right' }}>
            <CButton color="info" onClick={handleEditClick}>
              <CIcon icon={cilPencil} /> Edit
            </CButton>
          </div>
          <CListGroupItem><strong>Student ID:</strong> {student.studentId}</CListGroupItem>
          <CListGroupItem><strong>Full Name:</strong> {student.fullName}</CListGroupItem>
          <CListGroupItem><strong>Email:</strong> {student.email}</CListGroupItem>
          <CListGroupItem><strong>Phone Number:</strong> {student.phoneNumber}</CListGroupItem>
          <CListGroupItem><strong>Parent Phone:</strong> {student.parentPhone}</CListGroupItem>
          <CListGroupItem><strong>Date of Birth:</strong> {student.dob}</CListGroupItem>
          <CListGroupItem><strong>Address:</strong> {student.address}</CListGroupItem>
        </>
      ) : (
        <CForm>
          <CRow>
            <CCol md={6}>
              <CFormInput
                type="text"
                name="fullName"
                label="Full Name"
                value={editedInfo.fullName}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="email"
                name="email"
                label="Email"
                value={editedInfo.email}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormInput
                type="text"
                name="phoneNumber"
                label="Phone Number"
                value={editedInfo.phoneNumber}
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                name="parentPhone"
                label="Parent Phone"
                value={editedInfo.parentPhone}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CRow className="mt-3">
            <CCol md={6}>
              <CFormInput
                type="date"
                name="dob"
                label="Date of Birth"
                value={formatDate(editedInfo.dob)} // Format date for date input field
                onChange={handleInputChange}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                name="address"
                label="Address"
                value={editedInfo.address}
                onChange={handleInputChange}
              />
            </CCol>
          </CRow>
          <CButton color="success" className="mt-3" onClick={handleSaveClick}>
            Save
          </CButton>
        </CForm>
      )}
    </CListGroup>
  );
};

export default StudentInfo;
