import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddVisitor = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interestedCountries: '',
    targetedIntake: '',
  });

  const [file, setFile] = useState(null); // Separate state for the file
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]); // State for employee list
  const [selectedEmployee, setSelectedEmployee] = useState(''); // State for selected employee
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch employees list
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees-without-pagination');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle input change for both text inputs and file inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'nidOrBirthCertificate') {
      setFile(files[0]);
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleEmployeeChange = (e) => {
    setSelectedEmployee(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('interestedCountries', formData.interestedCountries);
    data.append('targetedIntake', formData.targetedIntake);
    data.append('employeeId', selectedEmployee); // Include selected employee ID
    if (file) {
      data.append('nidOrBirthCertificate', file);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/visitors/add-visitor', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Visitor data submitted:', response.data);

      const employee = localStorage.getItem('employee');
      const firstRole = JSON.parse(employee).role[0]; // Use the first role for redirection
      navigate(`/${firstRole}-view-visitors`);
    } catch (error) {
      console.error('Error submitting visitor data:', error);
      // Handle error
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
                      value={formData.name}
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
                      value={formData.email}
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
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel htmlFor="interestedCountries">Interested Countries</CFormLabel>
                    <CFormInput
                      type="text"
                      id="interestedCountries"
                      name="interestedCountries"
                      value={formData.interestedCountries}
                      onChange={handleChange}
                      required
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
                      value={formData.targetedIntake}
                      onChange={handleChange}
                      required
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12}>
                    <CFormLabel htmlFor="employee">Assign Employee</CFormLabel>
                    <CFormSelect
                      id="employee"
                      value={selectedEmployee}
                      onChange={handleEmployeeChange}
                      required
                    >
                      <option value="">Select an Employee</option>
                      {employees.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name}
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

export default AddVisitor;
