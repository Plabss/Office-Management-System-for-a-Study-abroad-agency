/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CFormSelect,
} from '@coreui/react';

const AddStudent = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newStudentId, setNewStudentId] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    parentPhone: '',
    dob: '',
    address: '',
    counselor: '', // New field for counselor
  });
  const navigate = useNavigate();

  // Simulate fetching counselors from an API
  useEffect(() => {
    // Fake API call to fetch counselors
    const fetchCounselors = async () => {
      const fakeCounselors = [
        { id: 'c1', name: 'Dr. John Doe' },
        { id: 'c2', name: 'Ms. Jane Smith' },
        { id: 'c3', name: 'Mr. Alan Brown' },
      ];
      setCounselors(fakeCounselors);
    };

    fetchCounselors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace with your API endpoint to submit form data

    alert('Done')

    // After submission, you can reset the form or navigate away
    setLoading(false);
  };

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <h2>Add Student</h2>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="studentId">Student ID</CFormLabel>
                    <CFormInput
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId || newStudentId}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="phoneNumber">Phone Number</CFormLabel>
                    <CFormInput
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="parentPhone">Parent Phone</CFormLabel>
                    <CFormInput
                      type="text"
                      id="parentPhone"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleInputChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
                    <CFormInput
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="address">Address</CFormLabel>
                    <CFormInput
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </CCol>
                </CRow>

                {/* Counselor Selection */}
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="counselor">Assign Counselor</CFormLabel>
                    <CFormSelect
                      id="counselor"
                      name="counselor"
                      value={formData.counselor}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>Select a Counselor</option>
                      {counselors.map((counselor) => (
                        <option key={counselor.id} value={counselor.name}>
                          {counselor.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Submit'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default AddStudent;
