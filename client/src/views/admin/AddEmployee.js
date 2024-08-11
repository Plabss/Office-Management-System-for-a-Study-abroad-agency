import React, { useState } from 'react';
import axios from 'axios';
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
  CFormSelect,
  CRow,
  CSpinner,
} from '@coreui/react';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    cv: null,
    nid: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv' || name === 'nid') {
      setEmployee((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setEmployee((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', employee.name);
    formData.append('email', employee.email);
    formData.append('phone', employee.phone);
    formData.append('role', employee.role);
    formData.append('cv', employee.cv);
    formData.append('nid', employee.nid);

    try {
      // Replace with your API endpoint
      const response = await axios.post('/api/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Employee data submitted:', response.data);
      // handle success (e.g., navigate to another page or show a success message)
    } catch (error) {
      console.error('Error submitting employee data:', error);
      // handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <h2>Add Employee</h2>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="name">Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter name"
                      value={employee.name}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      value={employee.email}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="phone">Phone</CFormLabel>
                    <CFormInput
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter phone number"
                      value={employee.phone}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="role">Role</CFormLabel>
                    <CFormSelect
                      id="role"
                      name="role"
                      value={employee.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select role</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="visa-admin">Visa Admin</option>
                      <option value="application-admin">Application Admin</option>
                      <option value="counselor">Counselor</option>
                      <option value="admin">Admin</option>
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="cv">CV/Resume</CFormLabel>
                    <CFormInput
                      type="file"
                      id="cv"
                      name="cv"
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="nid">NID</CFormLabel>
                    <CFormInput
                      type="file"
                      id="nid"
                      name="nid"
                      onChange={handleChange}
                      required
                    />
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

export default AddEmployee;
