// TableSection.js
import React from 'react'
import {
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const TableSection = ({ data }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handleDetailsClick = (studentId) => {
    dispatch({ type: 'addElement', key: 'studentId', value: studentId })
    navigate('/view-student')
  }

  return (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Phone Number</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data.map((student) => (
          <CTableRow key={student._id}>
            <CTableDataCell>{student.fullName}</CTableDataCell>
            <CTableDataCell>{student.email}</CTableDataCell>
            <CTableDataCell>{student.phoneNumber}</CTableDataCell>
            <CTableDataCell>
              <CIcon icon={cilInfo} size="lg" onClick={() => handleDetailsClick(student._id)} />
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default TableSection
