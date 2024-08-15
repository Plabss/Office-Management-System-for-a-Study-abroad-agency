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
import { useSelector } from 'react-redux'
import CourseDocuments from './CourseDocuments'

const CourseDetails = () => {
  const courseId = localStorage.getItem('courseId');
  const studentId = localStorage.getItem('studentId');

  // State for course details
  const [course, setCourse] = useState({})
  const [documents, setDocuments] = useState({ file1: null, file2: null, file3: null })
  const [selectedApplicant, setSelectedApplicant] = useState('')
  const [applicants, setApplicants] = useState([])

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees')
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setApplicants(response.data)
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
        console.log(courseData)
        setCourse(courseData)
        // Initialize document state based on courseData
        setDocuments(courseData.documents || { file1: null, file2: null, file3: null })
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }

    fetchApplicants()
    fetchCourseDetails()
  }, [courseId])

  const handleAssignApplicant = async () => {
    if (selectedApplicant) {
      try {
        await axios.post(`http://localhost:5000/api/v1/employees/assign-applicant/${courseId}/${studentId}`, { applicantId: selectedApplicant })
        alert(`Applicant ${selectedApplicant} has been assigned to the course.`)
      } catch (error) {
        console.error('Error assigning applicant:', error)
        alert('Error assigning applicant.')
      }
    } else {
      alert('Please select an applicant before assigning.')
    }
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
              <h2>Course Details</h2>
              {console.log('course', course)}
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Course Name:</strong> {course.name}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Level:</strong> {course.level}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>University:</strong> {course.university}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Country:</strong> {course.country}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Applied:</strong> {course.applied}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Details:</strong> {course.details}
                </CListGroupItem>
              </CListGroup>

              {/* Applicant Selection */}
              {course.applicant === null ? (
                <div>
                  <h4 className="mt-4">Assign Applicant</h4>
                  <CFormSelect
                    id="applicant"
                    name="applicant"
                    value={selectedApplicant}
                    onChange={(e) => setSelectedApplicant(e.target.value)}
                  >
                    <option value="" disabled>
                      Select an Applicant
                    </option>
                    {Array.isArray(applicants) &&
                      applicants.map((applicant) => (
                        <option key={applicant._id} value={applicant._id}>
                          {applicant.name}
                        </option>
                      ))}
                  </CFormSelect>
                  <CButton color="primary" className="mt-2" onClick={handleAssignApplicant}>
                    Assign Applicant
                  </CButton>
                </div>
              ) : (
                <>
                  <h4>Applicant Assigned already</h4>
                  <CourseDocuments
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

export default CourseDetails
