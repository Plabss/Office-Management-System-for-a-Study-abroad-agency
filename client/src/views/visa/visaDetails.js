import React, { useState, useEffect } from 'react'
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
  CFormSelect,
  CFormLabel,
} from '@coreui/react'
import axios from 'axios'

import CourseDocuments from './CourseDocuments'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import VisaDocuments from './visaDocuments'

const VisaDetails = () => {
  const courseId = localStorage.getItem('courseId')
  const studentId = localStorage.getItem('studentId')
  const visaId = localStorage.getItem('visaId')

  const dispatch = useDispatch()

  // State for course details
  const [visa, setVisa] = useState({})
  const [documents, setDocuments] = useState({ file1: null, file2: null, file3: null })
  const [selectedVisaAdmin, setSelectedVisaAdmin] = useState({})
  const [visaAdmins, setVisaAdmins] = useState([])
  const visaDocUpload = useSelector((state) => state.visaDocUpload)
  const assignVisaAdmin = useSelector((state) => state.assignVisaAdmin)

  useEffect(() => {
    const fetchVisaAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees')
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setVisaAdmins(response.data)
          console.log('visa-admins selected for', response.data)
        } else {
          console.error('Unexpected data format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/courses/get-a-course/${courseId}`,
        )
        const courseData = response.data
        console.log('courseData', courseData)
        setCourse(courseData)
        // Initialize document state based on courseData
        setDocuments(courseData.documents || { file1: null, file2: null, file3: null })
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }

    fetchVisaAdmins()
    fetchCourseDetails()
  }, [assignVisaAdmin,visaDocUpload,assignVisaAdmin])

  const handleAssignVisaAdmin = async () => {
    if (selectedVisaAdmin) {
      console.log('selectedVisaAdmin', selectedVisaAdmin)
      try {
        const res = await axios.post(
          `http://localhost:5000/api/v1/employees/assign-visa-admin/${courseId}/${studentId}`,
          {
            visaAdminId: selectedVisaAdmin?._id,
            visaAdminName: selectedVisaAdmin?.name,
          },
        )
        if (res.status === 200) {
          toast.success(`Visa admin ${selectedVisaAdmin?.name} has been assigned to the student.`)
          dispatch({ type: 'toggleElement', key: 'assignVisaAdmin' })
        }
      } catch (error) {
        console.error('Error assigning applicant:', error)
        toast.error('Error assigning visa admin.')
      }
    } else {
      toast.error('Please select an visa admin before assigning.')
    }
  }

  const handleVisaAdminChange = (e) => {
    const selectedId = e.target.value
    const selected = visaAdmins.find((visaAdmin) => visaAdmin._id === selectedId)
    setSelectedApplicant(selected)
  }

  const handleDocumentUpload = (updatedDocuments) => {
    setDocuments(updatedDocuments)
  }

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <h2>Visa Details</h2>
              {console.log('visa', visa)}
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Country:</strong> {visa.country}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>University:</strong> {visa.university}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Course:</strong> {visa.course}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Applied:</strong> {visa.applied}
                </CListGroupItem>
              </CListGroup>

              {/* Visa admin Selection */}
              {visa.visaAdmin?._id === null ? (
                <div>
                  <h4 className="mt-4">Assign Visa Admin</h4>
                  <CFormSelect
                    id="visaAdmin"
                    name="visaAdmin"
                    value={selectedVisaAdmin?._id || ''}
                    onChange={handleVisaAdminChange}
                  >
                    <option value="">Select an Visa Admin</option>
                    {Array.isArray(visaAdmins) &&
                      visaAdmins.map((visaAdmin) => (
                        <option key={visaAdmin._id} value={visaAdmin._id}>
                          {visaAdmin.name}
                        </option>
                      ))}
                  </CFormSelect>
                  <CButton color="primary" className="mt-2" onClick={handleAssignVisaAdmin}>
                    Assign visa admin
                  </CButton>
                </div>
              ) : (
                <>
                  <h4>{visa?.visaAdmin?.name} is assigned as applicant</h4>
                  {console.log(visa.visaAdmin)}
                  <VisaDocuments
                    documents={documents}
                    onDocumentUpload={handleDocumentUpload}
                    courseId={courseId}
                  />
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default VisaDetails
