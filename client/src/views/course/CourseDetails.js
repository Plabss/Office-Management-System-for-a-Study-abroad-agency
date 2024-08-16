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

const CourseDetails = () => {
  const courseId = localStorage.getItem('courseId');
  const studentId = localStorage.getItem('studentId');

  const dispatch = useDispatch();

  // State for course details
  const [course, setCourse] = useState({})
  const [documents, setDocuments] = useState({ file1: null, file2: null, file3: null })
  const [selectedApplicant, setSelectedApplicant] = useState({})
  const [applicants, setApplicants] = useState([])
  const assignApplicant = useSelector((state) => state.assignApplicant)
  const courseDocUpload = useSelector(state => state.courseDocUpload);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees')
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setApplicants(response.data)
          console.log("applicants selected for",response.data)
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
        console.log("courseData",courseData)
        setCourse(courseData)
        // Initialize document state based on courseData
        setDocuments(courseData.documents || { file1: null, file2: null, file3: null })
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }

    fetchApplicants()
    fetchCourseDetails()
  }, [assignApplicant,courseDocUpload])

  const handleAssignApplicant = async () => {
    if (selectedApplicant) {
      console.log("selectedApplicant",selectedApplicant)
      try {
        const res=await axios.post(`http://localhost:5000/api/v1/employees/assign-applicant/${courseId}/${studentId}`, {
          applicantId: selectedApplicant?._id,
          applicantName: selectedApplicant?.name,
        })
        if(res.status === 200){
          toast.success(`Applicant ${selectedApplicant?.name} has been assigned to the course.`)
          dispatch({ type: 'toggleElement', key: 'assignApplicant' })
        }
      } catch (error) {
        console.error('Error assigning applicant:', error)
        toast.error('Error assigning applicant.')
      }
    } else {
      toast.error('Please select an applicant before assigning.')
    }
  }

  const handleApplicantChange = (e) => {
    const selectedId = e.target.value
    const selected = applicants.find(applicant => applicant._id === selectedId)
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
              {course.applicant?._id === null ? (
                <div>
                  <h4 className="mt-4">Assign Applicant</h4>
                  <CFormSelect
                    id="applicant"
                    name="applicant"
                    value={selectedApplicant?._id || ''}
                    onChange={handleApplicantChange}
                  >
                    <option value="">
                      Select an Applicant
                    </option>
                    {Array.isArray(applicants) &&
                      applicants.map((applicant) => (
                        <option key={applicant._id} value={applicant._id}>
                          {applicant.name}
                        </option>
                      ))}
                  </CFormSelect>
                  <CButton color="primary" className="mt-2" onClick={handleAssignApplicant} >
                    Assign Applicant
                  </CButton>
                </div>
              ) : (
                <>
                  <h4>{course?.applicant?.name} is assigned as applicant</h4>
                  {console.log(course.applicant)}
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
