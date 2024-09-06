// TableSection.js
import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDescription, cilInfo } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const TableSection = ({ data }) => {

  console.log("ddddddddddddddddddd",data)
  const navigate =useNavigate();
  const handleDetailsClick = (studentId) => {
    localStorage.setItem('studentId', studentId);
    navigate("/view-student")
  }

  return (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Name</CTableHeaderCell>
          <CTableHeaderCell>Email</CTableHeaderCell>
          <CTableHeaderCell>Phone Number</CTableHeaderCell>
          <CTableHeaderCell>Details</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {data?.map((student) => (
          <CTableRow key={student._id}>
            <CTableDataCell>{student.fullName}</CTableDataCell>
            <CTableDataCell>{student.email}</CTableDataCell>
            <CTableDataCell>{student.phoneNumber}</CTableDataCell>
            <CTableDataCell>
              <CIcon icon={cilDescription} style={{ color: 'blue' }} size="lg" onClick={() => handleDetailsClick(student._id)} />
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  )
}

export default TableSection
