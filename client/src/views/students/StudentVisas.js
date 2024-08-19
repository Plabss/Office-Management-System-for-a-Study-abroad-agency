import React, { useState } from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CForm,
  CFormLabel,
  CButton,
  CSpinner,
  CRow,
  CCol,
} from '@coreui/react'
import { cilInfo } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'

const StudentVisas = ({ visas, onAddVisa }) => {
  const navigate = useNavigate()

  const [newVisa, setNewVisa] = useState({
    course: '',
    university: '',
    country: '',
  })

  const [addingVisa, setAddingVisa] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewVisa({
      ...newVisa,
      [name]: value,
    })
  }

  const handleAddVisa = async (e) => {
    e.preventDefault()
    setAddingVisa(true)
    try {
      await onAddVisa(newVisa)
      setNewVisa({
        course: '',
        university: '',
        country: '',
      })
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
              <CTableDataCell>{visa.course.courseName}</CTableDataCell>
              <CTableDataCell>{visa.course.courseUniversity}</CTableDataCell>
              <CTableDataCell>{visa.country}</CTableDataCell>
              <CTableDataCell>
                <CIcon icon={cilInfo} size="lg" onClick={() => handleDetailsClick(visa._id)} />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CForm className="mt-4" onSubmit={handleAddVisa}>
        <CRow>
          <CCol md={6}>
            <CFormLabel htmlFor="course">Course</CFormLabel>
            <CFormInput
              type="text"
              id="course"
              name="course"
              value={newVisa.course}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol md={6}>
            <CFormLabel htmlFor="university">University</CFormLabel>
            <CFormInput
              type="text"
              id="university"
              name="university"
              value={newVisa.university}
              onChange={handleInputChange}
            />
          </CCol>
        </CRow>
        <CRow className="mt-3">
          <CCol md={6}>
            <CFormLabel htmlFor="country">Country</CFormLabel>
            <CFormInput
              type="text"
              id="country"
              name="country"
              value={newVisa.country}
              onChange={handleInputChange}
            />
          </CCol>
          <CCol md={6} className="d-flex align-items-end">
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
