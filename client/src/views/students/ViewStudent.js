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
import StudentVisas from './StudentVisas'

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import StudentDiscussions from './StudentDiscussions'

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
  const [visas, setVisas] = useState()
  const [discussions, setDiscussions] = useState([])

  const studentId = localStorage.getItem('studentId')
  const employee = JSON.parse(localStorage.getItem('employee'))
  const assignedBy = {
    name: employee.name,
    _id: employee._id,
  }
  const role = employee.role[0]
  const upload = useSelector((state) => state.upload)
  const addCourse = useSelector((state) => state.addCourse)
  const addVisa = useSelector((state) => state.addVisa)
  const notificationClick = useSelector((state) => state.notificationClick)
  const addDiscussion = useSelector((state) => state.addDiscussion)
  const updateStudentData = useSelector((state) => state.updateStudentData)

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
          counselor: studentData.employees.asCounselor,
          applicant: studentData.employees.asApplicant,
          visaOfficer: studentData.employees.asVisaAdmin,
        })

        setDocuments(studentData.documents || { cv: null, nid: null })
        setCourses(studentData.courses) // This now contains detailed course objects
        setVisas(studentData.visas)
        setDiscussions(studentData.discussions) // This now contains detailed discussion objects
      } catch (error) {
        setError('Failed to fetch student details.')
      }
    }

    fetchStudentDetails()
  }, [studentId, addDiscussion, upload, addCourse, addVisa, notificationClick, updateStudentData])

  const handleAddCourse = async (newCourse) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/courses/add-course`, {
        ...newCourse,
        studentId: studentId, // Assuming the course needs to be associated with the student
        assignedBy: assignedBy, // Assuming the course to be associated by the employee
      })
      if (response.status === 201) {
        console.log('status: ', response.status)
        dispatch({ type: 'toggleElement', key: 'addCourse' })
        const addedCourse = response.data
        setCourses((prevCourses) => [...prevCourses, addedCourse.savedCourse])
      } else {
        console.error('Failed to add course:', response.data)
        setError('Failed to add course.')
      }
    } catch (error) {
      console.error('Failed to add course:', error)
      setError('Failed to add course.')
    }
  }

  const handleAddVisa = async (courseId) => {
    try {
      const courseResponse = await axios.get(
        `http://localhost:5000/api/v1/courses/get-a-course/${courseId}`,
      ) // Replace with the actual endpoint for fetching course details

      if (courseResponse.status !== 200) {
        console.error('Failed to fetch course details:', courseResponse.data)
        setError('Failed to fetch course details.')
        return
      }

      const courseDetails = courseResponse.data // Assuming course details are returned in the response

      // Prepare the visa data with course details
      const visaData = {
        student: {
          _id: studentId, // Associating the visa to be added by
        },
        assignedBy: {
          _id: assignedBy._id, // Associating the visa to be added by the employee
          name: assignedBy.name,
        },
        course: {
          courseId: courseId,
          courseName: courseDetails.name,
          courseUniversity: courseDetails.university,
        },
        country: courseDetails.country,
      }

      // Post the new visa with the retrieved course details
      const response = await axios.post(`http://localhost:5000/api/v1/visas/add-visa`, visaData)

      if (response.status === 201) {
        console.log('Visa added successfully, status: ', response.status)

        // Update the visas state to include the newly added visa
        const addedVisa = response.data
        setVisas((prevVisas) => [...prevVisas, addedVisa.savedVisa])

        // Dispatch action to update any state in Redux if required
        dispatch({ type: 'toggleElement', key: 'addVisa' })
      } else {
        console.error('Failed to add visa:', response.data)
        setError('Failed to add visa.')
      }
    } catch (error) {
      console.error('Failed to add visa:', error)
      setError('Failed to add visa.')
    }
  }

  const handleAddDiscussion = async (newDiscussion) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/students/add-discussion/${studentId}`,
        {
          ...newDiscussion,
          assignedBy: assignedBy, // Assuming the discussion to be associated by the employee
        },
      )
      if (response.status === 201) {
        console.log('status: ', response.status)
        dispatch({ type: 'toggleElement', key: 'addDiscussion' })
        const addedDiscussion = response.data
        setDiscussions((prevDiscussions) => [...prevDiscussions, addedDiscussion.savedDiscussion])
      } else {
        console.error('Failed to add discussion:', response.data)
        setError('Failed to add discussion.')
      }
    } catch (error) {
      console.error('Failed to add discussion:', error)
      setError('Failed to add discussion.')
    }
  }
  const handleDeleteDiscussion = async (discussionId) => {
    try {
      console.log('ddddd', discussionId)
      const response = await axios.delete(
        `http://localhost:5000/api/v1/students/delete-discussion/${studentId}/${discussionId}`,
      )
      if (response.status === 200) dispatch({ type: 'toggleElement', key: 'addDiscussion' })
    } catch (error) {
      console.error('Failed to delete discussion:', error)
      setError('Failed to delete discussion.')
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

  const handleSaveStudentInfo = async (updatedInfo) => {
    console.log("updatedInfo", updatedInfo)
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/students/update-student-basic-info/${studentId}`,
        updatedInfo,
      )
      if (response.status === 200) {
        console.log('Student info updated successfully')
        setStudent(updatedInfo) // Update the student info state
        setBasicInfo(updatedInfo)
        dispatch({ type: 'toggleElement', key: 'updateStudentData' }) // Update basic info
      } else {
        console.error('Failed to update student info:', response.data)
        setError('Failed to update student info.')
      }
    } catch (error) {
      console.error('Failed to update student info:', error)
      setError('Failed to update student info.')
    }
  }

  return (
    <CContainer fluid className="mt-4">
      {console.log('courses', courses)}
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
                      {console.log('visassssssss', visas)}
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
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'discussions'}
                          onClick={() => setActiveTab('discussions')}
                        >
                          Discussions
                        </CNavLink>
                      </CNavItem>
                    </>
                  ) : null}
                </CNav>
                <CTabContent>
                  <CTabPane visible={activeTab === 'basic-info'}>
                    <StudentInfo
                      student={basicInfo}
                      setStudent={setBasicInfo}
                      onSave={handleSaveStudentInfo} // Pass the save function
                    />
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
                          studentName={basicInfo.fullName}
                        />
                      </CTabPane>
                      <CTabPane visible={activeTab === 'courses'}>
                        <StudentCourses courses={courses} onAddCourse={handleAddCourse} />
                      </CTabPane>
                      <CTabPane visible={activeTab === 'visa'}>
                        <StudentVisas visas={visas} onAddVisa={handleAddVisa} />
                      </CTabPane>
                      <CTabPane visible={activeTab === 'discussions'}>
                        <StudentDiscussions
                          discussions={discussions}
                          onAddDiscussion={handleAddDiscussion}
                          onDeleteDiscussion={handleDeleteDiscussion}
                        ></StudentDiscussions>
                      </CTabPane>
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
