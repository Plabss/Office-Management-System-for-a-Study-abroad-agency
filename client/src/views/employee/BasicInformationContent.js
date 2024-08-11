import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CFormSelect,
  CRow,
  CListGroup,
  CListGroupItem,
  CFormCheck
} from '@coreui/react';

const BasicInformationContent = () => {
  const [employee, setEmployee] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    roles: ['receptionist', 'counselor'],
  });

  const [role, setRole] = useState('');

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleAddRole = () => {
    if (role && !employee.roles.includes(role)) {
      setEmployee((prevState) => ({
        ...prevState,
        roles: [...prevState.roles, role],
      }));
      setRole('');
    }
  };

  const handleRemoveRole = (roleToRemove) => {
    setEmployee((prevState) => ({
      ...prevState,
      roles: prevState.roles.filter((r) => r !== roleToRemove),
    }));
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h4>Basic Information</h4>
        </CCardHeader>
        <CCardBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="name"
                  value={employee.name}
                  readOnly
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="email">Email</CFormLabel>
                <CFormInput
                  type="email"
                  id="email"
                  value={employee.email}
                  readOnly
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="phone">Phone</CFormLabel>
                <CFormInput
                  type="tel"
                  id="phone"
                  value={employee.phone}
                  readOnly
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel htmlFor="role">Add Role</CFormLabel>
                <CFormSelect
                  id="role"
                  value={role}
                  onChange={handleRoleChange}
                >
                  <option value="">Select Role</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="visa-admin">Visa Admin</option>
                  <option value="application-admin">Application Admin</option>
                  <option value="counselor">Counselor</option>
                  <option value="admin">Admin</option>
                </CFormSelect>
                <CButton color="primary" onClick={handleAddRole} className="mt-2">
                  Add Role
                </CButton>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CFormLabel>Roles</CFormLabel>
                <CListGroup>
                  {employee.roles.map((r, index) => (
                    <CListGroupItem key={index}>
                      {r}
                      <CButton
                        color="danger"
                        size="sm"
                        onClick={() => handleRemoveRole(r)}
                        className="float-end"
                      >
                        Remove
                      </CButton>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default BasicInformationContent;
