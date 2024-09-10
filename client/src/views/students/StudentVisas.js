import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormLabel,
  CButton,
  CSpinner,
  CRow,
  CCol,
  CFormSelect,
} from '@coreui/react'
import { cilInfo } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import axios from 'axios'

const StudentVisas = ({ visas, onAddVisa }) => {
  const navigate = useNavigate()
  const studentId = localStorage.getItem('studentId')

  const [courses, setCourses] = useState([]) // State to store courses
  const [selectedCourse, setSelectedCourse] = useState('') // State for selected course
  const [addingVisa, setAddingVisa] = useState(false)

  useEffect(() => {
    // Fetch courses for the student using studentId from localStorage
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/students/get-student-courses/${studentId}`)
        setCourses(response.data) // Set courses fetched from the server
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      }
    }

    fetchCourses()
  }, [studentId])

  const handleAddVisa = async (e) => {
    e.preventDefault()
    if (!selectedCourse) {
      console.error('Please select a course.')
      return
    }

    setAddingVisa(true)
    try {
      await onAddVisa(selectedCourse)
      console.log("selectedCourse",selectedCourse) // Pass selected course to the onAddVisa function
      setSelectedCourse('') // Reset selection after adding
    } catch (error) {
      console.error('Failed to add visa:', error)
    } finally {
      setAddingVisa(false)
    }
  }

  const handleDetailsClick = (visaId) => {
    localStorage.setItem('visaId', visaId)
    navigate('/applied-visa')
  }

  return (
    <>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Course</CTableHeaderCell>
            <CTableHeaderCell>University</CTableHeaderCell>
            <CTableHeaderCell>Country</CTableHeaderCell>
            <CTableHeaderCell>Details</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {visas.map((visa, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{visa?.course?.courseName}</CTableDataCell>
              <CTableDataCell>{visa?.course?.courseUniversity}</CTableDataCell>
              <CTableDataCell>{visa?.country}</CTableDataCell>
              <CTableDataCell>
                <CIcon icon={cilInfo} size="lg" onClick={() => handleDetailsClick(visa._id)} />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CForm className="mt-4" onSubmit={handleAddVisa}>
        <CRow>
          <CCol md={12}>
            <CFormLabel htmlFor="course">Select Course</CFormLabel>
            <CFormSelect
              id="course"
              name="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} - {course.university} - {course.country}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={12} className="d-flex align-items-end">
            <CButton type="submit" color="primary" className="mt-3 w-100" disabled={addingVisa}>
              {addingVisa ? <CSpinner size="sm" /> : 'Add Visa'}
            </CButton>
          </CCol>
        </CRow>
      </CForm>
    </>
  )
}

export default StudentVisas
