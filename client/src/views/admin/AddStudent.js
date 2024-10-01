import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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
} from '@coreui/react'

const AddStudent = () => {
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    parentPhone: '',
    dob: '',
    address: '',
    counselor: '',
  })
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees-without-pagination');
    
        if (Array.isArray(response.data)) {
          // Filter out employees who are not disabled and have the role 'counselor'
          const activeCounselors = response.data.filter((employee) => 
            !employee.disabled && employee.role.includes('counselor')
          );
          setCounselors(activeCounselors);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching counselors:', error);
        // Handle error
      }
    };

    fetchCounselors()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/v1/students/add-student', {
        ...formData,
        employees: {
          asCounselor: formData.counselor,
        },
      })
      console.log('Student data submitted:', response.data)
      const employee = localStorage.getItem('employee')
      console.log('aaaaaaaaa',employee)
      const firstRole = JSON.parse(employee).role[0]; // Use the first role for redirection
      navigate(`/${firstRole}-view-students`);
    } catch (error) {
      console.error('Error submitting student data:', error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

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
                  <CCol md={12}>
                    <CFormLabel htmlFor="fullName">Full Name</CFormLabel>
                    <CFormInput
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
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
                      required
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
                      required
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
                      required
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
                      value={formData.address}
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
                      value={formData.counselor}
                      onChange={handleInputChange}
                      // required
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
                  {loading ? <CSpinner size="sm" /> : 'Submit'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default AddStudent
