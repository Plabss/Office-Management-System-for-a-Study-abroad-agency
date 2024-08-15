import React, { useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormInput,
  CFormLabel,
  CButton,
  CSpinner,
} from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import { useDispatch } from 'react-redux'

const StudentCourses = ({ courses, onAddCourse }) => {


  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [newCourse, setNewCourse] = useState({
    name: '',
    level: '',
    university: '',
    country: '',
    applied: '',
    details: '',
  })

  const [addingCourse, setAddingCourse] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewCourse({
      ...newCourse,
      [name]: value,
    })
  }

  const handleAddCourse = async (e) => {
    e.preventDefault()
    setAddingCourse(true)
    try {
      await onAddCourse(newCourse)
      setNewCourse({
        name: '',
        level: '',
        university: '',
        country: '',
        applied: '',
        details: '',
      })
    } catch (error) {
      console.error('Failed to add course:', error)
    } finally {
      setAddingCourse(false)
    }
  }

  const handleDetailsClick = (courseId) => {
    localStorage.setItem('courseId', courseId)
    navigate("/enrolled-course")
  }

  return (
    <>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Course Name</CTableHeaderCell>
            <CTableHeaderCell>Level</CTableHeaderCell>
            <CTableHeaderCell>University</CTableHeaderCell>
            <CTableHeaderCell>Country</CTableHeaderCell>
            <CTableHeaderCell>Applied</CTableHeaderCell>
            <CTableHeaderCell>Details</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {courses.map((course, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{course.name}</CTableDataCell>
              <CTableDataCell>{course.level}</CTableDataCell>
              <CTableDataCell>{course.university}</CTableDataCell>
              <CTableDataCell>{course.country}</CTableDataCell>
              <CTableDataCell>{course.applied}</CTableDataCell>
              <CTableDataCell>
                {/* <Link to="/enrolled-course">
                  <CIcon icon={cilInfo} size="sm" />
                </Link> */}
                <CButton color="info" onClick={() => handleDetailsClick(course._id)}>
                  <CIcon icon={cilInfo} size="lg" />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CForm className="mt-4" onSubmit={handleAddCourse}>
        <CFormLabel htmlFor="name">Course Name</CFormLabel>
        <CFormInput
          type="text"
          id="name"
          name="name"
          value={newCourse.name}
          onChange={handleInputChange}
        />
        <CFormLabel htmlFor="level">Level</CFormLabel>
        <CFormInput
          type="text"
          id="level"
          name="level"
          value={newCourse.level}
          onChange={handleInputChange}
        />
        <CFormLabel htmlFor="university">University</CFormLabel>
        <CFormInput
          type="text"
          id="university"
          name="university"
          value={newCourse.university}
          onChange={handleInputChange}
        />
        <CFormLabel htmlFor="country">Country</CFormLabel>
        <CFormInput
          type="text"
          id="country"
          name="country"
          value={newCourse.country}
          onChange={handleInputChange}
        />
        <CFormLabel htmlFor="applied">Applied</CFormLabel>
        <CFormInput
          type="text"
          id="applied"
          name="applied"
          value={newCourse.applied}
          onChange={handleInputChange}
        />
        <CFormLabel htmlFor="details">Details</CFormLabel>
        <CFormInput
          type="text"
          id="details"
          name="details"
          value={newCourse.details}
          onChange={handleInputChange}
        />
        <CButton type="submit" color="primary" className="mt-2" disabled={addingCourse}>
          {addingCourse ? <CSpinner size="sm" /> : 'Add Course'}
        </CButton>
      </CForm>
    </>
  )
}

export default StudentCourses
