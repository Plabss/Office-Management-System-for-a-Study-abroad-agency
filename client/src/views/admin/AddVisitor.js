/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
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
} from '@coreui/react';


const AddVisitor = () => {
  const [visitor, setVisitor] = useState({
    name: '',
    email: '',
    phone: '',
    interestedCountries: '',
    nidOrBirthCertificate: null,
    targetedIntake: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'nidOrBirthCertificate') {
      setVisitor((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setVisitor((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace with your API endpoint
    const formData = new FormData();
    formData.append('name', visitor.name);
    formData.append('email', visitor.email);
    formData.append('phone', visitor.phone);
    formData.append('interestedCountries', visitor.interestedCountries);
    formData.append('nidOrBirthCertificate', visitor.nidOrBirthCertificate);
    formData.append('targetedIntake', visitor.targetedIntake);

  };

  return (
    <CContainer className="mt-4">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <h2>Add Visitor</h2>
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
                      value={visitor.name}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="email">Email</CFormLabel>
                    <CFormInput
                      type="email"
                      id="email"
                      name="email"
                      value={visitor.email}
                      onChange={handleChange}
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
                      value={visitor.phone}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="interestedCountries">Interested Countries</CFormLabel>
                    <CFormInput
                      type="text"
                      id="countries"
                      name="countries"
                      value={visitor.countries}
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="nidOrBirthCertificate">NID/Birth Certificate</CFormLabel>
                    <CFormInput
                      type="file"
                      id="nidOrBirthCertificate"
                      name="nidOrBirthCertificate"
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="targetedIntake">Targeted Intake</CFormLabel>
                    <CFormInput
                      type="text"
                      id="targetedIntake"
                      name="targetedIntake"
                      value={visitor.targetedIntake}
                      onChange={handleChange}
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

export default AddVisitor;
