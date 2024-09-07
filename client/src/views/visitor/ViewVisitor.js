import React, { useEffect, useState } from 'react';
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
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ViewVisitor = () => {
    const navigate = useNavigate()
  const [visitor, setVisitor] = useState({});
  const [counselors, setCounselors] = useState([]); // State for storing counselors
  const [loading, setLoading] = useState(false);
  const [conversionData, setConversionData] = useState({
    parentPhone: '',
    dob: '',
    address: '',
    counselor: '',
  });

  // Get the visitor ID from local storage
  const visitorId = localStorage.getItem('visitorId');

  useEffect(() => {
    // Fetch the visitor details by ID
    const fetchVisitorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/visitors/get-a-visitor/${visitorId}`);
        setVisitor(response.data[0]);
      } catch (error) {
        console.error('Error fetching visitor details:', error);
      }
    };

    // Fetch all available counselors
    const fetchCounselors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees');
        if (Array.isArray(response.data)) {
          setCounselors(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching counselors:', error);
      }
    };

    fetchVisitorDetails();
    fetchCounselors();
  }, [visitorId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConversionData({
      ...conversionData,
      [name]: value,
    });
  };

  const handleConversion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:5000/api/v1/visitors/convert-to-student/${visitorId}`, conversionData);
      console.log('Conversion successful:', response.data);
      toast.success('Visitor successfully converted to student.');
      const employee = localStorage.getItem('employee')
      console.log('aaaaaaaaa',employee)
      const firstRole = JSON.parse(employee).role[0]; // Use the first role for redirection
      navigate(`/${firstRole}-view-students`);
    } catch (error) {
      console.error('Error converting visitor to student:', error);
      alert('Error converting visitor to student.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CContainer className="mt-4">
      {/* Display Visitor Information */}
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <h2>Visitor Details</h2>
            </CCardHeader>
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Name:</strong> {visitor.name}
                </CCol>
                <CCol md={6}>
                  <strong>Email:</strong> {visitor.email}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Phone:</strong> {visitor.phone}
                </CCol>
                <CCol md={6}>
                  <strong>Interested Countries:</strong> {visitor.interestedCountries}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <strong>Targeted Intake:</strong> {visitor.targetedIntake}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Form to Convert Visitor to Student */}
      <CRow className="justify-content-center mt-4">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <h2>Convert to Student</h2>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleConversion}>
                <CRow className="mb-3">
                  <CCol md={6}>
                    <CFormLabel htmlFor="parentPhone">Parent Phone</CFormLabel>
                    <CFormInput
                      type="text"
                      id="parentPhone"
                      name="parentPhone"
                      value={conversionData.parentPhone}
                      onChange={handleInputChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
                    <CFormInput
                      type="date"
                      id="dob"
                      name="dob"
                      value={conversionData.dob}
                      onChange={handleInputChange}
                      required
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
                      value={conversionData.address}
                      onChange={handleInputChange}
                      required
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
                      value={conversionData.counselor}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="" disabled>
                        Select a Counselor
                      </option>
                      {Array.isArray(counselors) &&
                        counselors.map((counselor) => (
                          <option key={counselor._id} value={counselor._id}>
                            {counselor.name}
                          </option>
                        ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? <CSpinner size="sm" /> : 'Convert to Student'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ViewVisitor;
