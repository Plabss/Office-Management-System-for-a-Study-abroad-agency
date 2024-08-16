import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import StudentInfo from './StudentInfo'
import StudentProgress from './StudentProgress'
import StudentDocuments from './StudentDocuments'
import StudentCourses from './StudentCourses'
import VisaUploads from './VisaUploads'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

const ViewStudent = () => {
  const [activeTab, setActiveTab] = useState('basic-info')
  const [student, setStudent] = useState(null)
  const [error, setError] = useState(null)

  const dispatch = useDispatch()

  // Declare separate states for each section
  const [basicInfo, setBasicInfo] = useState({})
  const [progress, setProgress] = useState()
  const [documents, setDocuments] = useState({ cv: null, nid: null })
  const [courses, setCourses] = useState([])
  const [visa, setVisa] = useState({})

  const studentId = localStorage.getItem('studentId')
  const employee = JSON.parse(localStorage.getItem('employee'))
  const assignedBy = {
    name: employee.name,
    _id: employee._id,
  }
  const role = localStorage.getItem('role')
  const upload = useSelector((state) => state.upload)
  const addCourse = useSelector((state) => state.addCourse)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/students/get-a-student/${studentId}`,
        )
        const studentData = response.data
        setStudent(studentData)

        console.log('xxxxxxxxxxxxxxxx', studentData)
        console.log('yyyyyyy', assignedBy)

        // Set initial states for each section
        setBasicInfo({
          studentId: studentData._id,
          fullName: studentData.fullName,
          email: studentData.email,
          phoneNumber: studentData.phoneNumber,
          parentPhone: studentData.parentPhone,
          dob: studentData.dob,
          address: studentData.address,
        })
        setProgress({
          progress: studentData.progress,
          counselor: studentData.employees.asCounselor[0],
          applicant: studentData.employees.asApplicant[0],
          visaOfficer: studentData.employees.asVisaAdmin[0],
        })
        setDocuments(studentData.documents || { cv: null, nid: null })
        setCourses(studentData.courses) // This now contains detailed course objects
        setVisa(studentData.visaUploads || {})
      } catch (error) {
        setError('Failed to fetch student details.')
      }
    }

    fetchStudentDetails()
  }, [studentId, upload, addCourse])

  const handleAddCourse = async (newCourse) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/courses/add-course`, {
        ...newCourse,
        studentId: studentId, // Assuming the course needs to be associated with the student
        assignedBy: assignedBy, // Assuming the course to be associated by the employee
      })
      if (response.status  === 201) {
        console.log("status: ",response.status)
        dispatch({ type: 'toggleElement', key: 'addCourse' })
        const addedCourse = response.data;
        setCourses((prevCourses) => [...prevCourses, addedCourse.savedCourse])
      }else{
        console.error('Failed to add course:', response.data)
        setError('Failed to add course.')
      }
    } catch (error) {
      console.error('Failed to add course:', error)
      setError('Failed to add course.')
    }
  }

  const handleDocumentUpload = (updatedDocuments) => {
    setDocuments(updatedDocuments)
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!student) {
    return <div>Loading...</div>
  }

  return (
    <CContainer fluid className="mt-4">
      {
        console.log("courses",courses)
      }
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Student Details</h2>
            </CCardHeader>
            <CCardBody>
              <CTabs activeItemKey={activeTab}>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 'basic-info'}
                      onClick={() => setActiveTab('basic-info')}
                    >
                      Basic Info
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 'progress'}
                      onClick={() => setActiveTab('progress')}
                    >
                      Progress
                    </CNavLink>
                  </CNavItem>
                  {role !== 'receptionist' ? (
                    <>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'documents'}
                          onClick={() => setActiveTab('documents')}
                        >
                          Documents
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'courses'}
                          onClick={() => setActiveTab('courses')}
                        >
                          Courses
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'visa'}
                          onClick={() => setActiveTab('visa')}
                        >
                          Visa
                        </CNavLink>
                      </CNavItem>
                    </>
                  ) : null}
                </CNav>
                <CTabContent>
                  <CTabPane visible={activeTab === 'basic-info'}>
                    <StudentInfo student={basicInfo} setStudent={setBasicInfo} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'progress'}>
                    <StudentProgress progress={progress} setProgress={setProgress} />
                  </CTabPane>
                  {role !== 'receptionist' ? (
                    <>
                      <CTabPane visible={activeTab === 'documents'}>
                        <StudentDocuments
                          documents={documents}
                          onDocumentUpload={handleDocumentUpload}
                        />
                      </CTabPane>
                      <CTabPane visible={activeTab === 'courses'}>
                        <StudentCourses courses={courses} onAddCourse={handleAddCourse} />
                      </CTabPane>
                      {/* <CTabPane visible={activeTab === 'visa'}>
                        <VisaUploads visa={visa} setVisa={setVisa} />
                      </CTabPane> */}
                    </>
                  ) : null}
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ViewStudent
