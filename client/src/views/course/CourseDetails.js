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
  CFormInput,
  CBadge,
} from '@coreui/react'
import axios from 'axios'
import CourseDocuments from './CourseDocuments'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import CIcon from '@coreui/icons-react'

const CourseDetails = () => {
  const courseId = localStorage.getItem('courseId')
  const studentId = localStorage.getItem('studentId')

  const dispatch = useDispatch()

  const [course, setCourse] = useState({})
  const [documents, setDocuments] = useState({ file1: null, file2: null, file3: null })
  const [selectedApplicant, setSelectedApplicant] = useState({})
  const [applicants, setApplicants] = useState([])
  const [b2bAgentName, setB2bAgentName] = useState('')
  const [applicationLink, setApplicationLink] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const assignApplicant = useSelector((state) => state.assignApplicant)
  const courseDocUpload = useSelector((state) => state.courseDocUpload)
  const courseDetailsUpdated = useSelector((state) => state.courseDetailsUpdated)

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/employees/get-all-employees-without-pagination',
        )
        if (Array.isArray(response.data)) {

          // Filter out employees who are not disabled and have the role 'applicant'
          const activeApplicants = response.data.filter((employee) => 
            !employee.disabled && employee.role.includes('applicant')
          );
          setApplicants(activeApplicants)
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
        setCourse(courseData)
        setB2bAgentName(courseData.b2bAgentName || '')
        setApplicationLink(courseData.applicationLink || '')
        setDocuments(courseData.documents || { file1: null, file2: null, file3: null })
        setIsEditing(!(courseData.b2bAgentName && courseData.applicationLink))
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }

    fetchApplicants()
    fetchCourseDetails()
  }, [assignApplicant, courseDocUpload, courseDetailsUpdated])

  const handleAssignApplicant = async () => {
    if (selectedApplicant) {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/v1/employees/assign-applicant/${courseId}/${studentId}`,
          {
            applicantId: selectedApplicant?._id,
            applicantName: selectedApplicant?.name,
          },
        )
        if (res.status === 200) {
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
    const selected = applicants.find((applicant) => applicant._id === selectedId)
    setSelectedApplicant(selected)
  }

  const handleDocumentUpload = (updatedDocuments) => {
    setDocuments(updatedDocuments)
  }

  const handleSaveDetails = async () => {
    if (!b2bAgentName || !applicationLink) {
      toast.error('Both fields are required.')
      return
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/v1/courses/update-course/${courseId}`,
        {
          b2bAgentName,
          applicationLink,
        },
      )

      if (res.status === 200) {
        toast.success('Details saved successfully.')
        dispatch({ type: 'toggleElement', key: 'courseDetailsUpdated' })
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error saving details:', error)
      toast.error('Error saving details.')
    }
  }

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard className="shadow-lg">
            <CCardHeader className="bg-primary text-white">
              <h2 className="mb-0">Course Details</h2>
            </CCardHeader>
            <CCardBody className="p-4">
              <CListGroup flush className="mb-4">
                {[
                  { label: 'Course Name', value: course.name, icon: 'cil-book' },
                  { label: 'Level', value: course.level, icon: 'cil-graduation' },
                  { label: 'University', value: course.university, icon: 'cil-school' },
                  { label: 'Country', value: course.country, icon: 'cil-globe-alt' },
                  {
                    label: 'Status',
                    value: (
                      <CBadge color={course.status === 'Active' ? 'success' : 'danger'}>
                        {course.status}
                      </CBadge>
                    ),
                    icon: 'cil-info',
                  },
                ].map((item, index) => (
                  <CListGroupItem
                    key={index}
                    className="d-flex justify-content-between align-items-center p-3 mb-2 shadow-sm rounded"
                    style={{
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '0.5rem',
                    }}
                  >
                    <div className="d-flex align-items-center">
                      {/* Icon */}
                      <CIcon icon={item.icon} className="me-3 text-primary" size="lg" />

                      {/* Label and Value */}
                      <div className='d-flex'>
                        <strong className="d-flex mb-1 mx-2" style={{ color: '#495057' }}>
                          {item.label}:
                        </strong>
                        <span style={{ fontWeight: 'bold', color: '#212529' }}>{item.value}</span>
                      </div>
                    </div>
                  </CListGroupItem>
                ))}
              </CListGroup>

              {/* Applicant Selection */}
              {course.applicant?._id === null ? (
                <div className="p-3 bg-light rounded">
                  <h4>Assign Applicant</h4>
                  <CFormSelect
                    id="applicant"
                    name="applicant"
                    value={selectedApplicant?._id || ''}
                    onChange={handleApplicantChange}
                    className="mt-3"
                  >
                    <option value="">Select an Applicant</option>
                    {Array.isArray(applicants) &&
                      applicants.map((applicant) => (
                        <option key={applicant._id} value={applicant._id}>
                          {applicant.name}
                        </option>
                      ))}
                  </CFormSelect>
                  <CButton color="primary" className="mt-3" onClick={handleAssignApplicant}>
                    Assign Applicant
                  </CButton>
                </div>
              ) : (
                <>
                  <h4 className="text-center fw-bold my-4">
                    <span  style={{'color':'blue'}}>{course?.applicant?.name}</span> has been assigned as applicant
                  </h4>
                  {b2bAgentName && applicationLink && !isEditing ? (
                    <div className="mt-4 p-3 bg-light rounded">
                      <p>
                        <strong>B2B Agent Name:</strong> {b2bAgentName}
                      </p>
                      <p>
                        <strong>Application Link:</strong>{' '}
                        <a href={applicationLink} target="_blank" rel="noopener noreferrer">
                          {applicationLink}
                        </a>
                      </p>
                      <CButton color="info" onClick={() => setIsEditing(true)}>
                        Edit
                      </CButton>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-light rounded">
                      <CFormLabel htmlFor="b2bAgentName">B2B Agent Name</CFormLabel>
                      <CFormInput
                        id="b2bAgentName"
                        value={b2bAgentName}
                        onChange={(e) => setB2bAgentName(e.target.value)}
                        placeholder="Enter B2B Agent Name"
                      />
                      <CFormLabel htmlFor="applicationLink" className="mt-3">
                        Application Link
                      </CFormLabel>
                      <CFormInput
                        id="applicationLink"
                        value={applicationLink}
                        onChange={(e) => setApplicationLink(e.target.value)}
                        placeholder="Enter Application Link"
                      />
                      <CButton
                        color="success"
                        className="mt-3"
                        onClick={handleSaveDetails}
                        disabled={!b2bAgentName || !applicationLink}
                      >
                        Save
                      </CButton>
                    </div>
                  )}
                  <CourseDocuments
                    documents={documents}
                    onDocumentUpload={handleDocumentUpload}
                    courseId={courseId}
                    courseName={course.name}
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
