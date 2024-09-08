import React from 'react'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDescription } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx' // Import xlsx library

const TableSection = ({ data }) => {
  const navigate = useNavigate()

  const handleDetailsClick = (studentId) => {
    localStorage.setItem('studentId', studentId)
    navigate('/view-student')
  }

  // Function to export table data as an Excel file
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data) // Convert JSON data to a worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students') // Append worksheet to workbook
    XLSX.writeFile(workbook, 'students_list.xlsx') // Write the workbook to a file
  }

  return (
    <>
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
          {data.map((student) => (
            <CTableRow key={student._id}>
              <CTableDataCell>{student.fullName}</CTableDataCell>
              <CTableDataCell>{student.email}</CTableDataCell>
              <CTableDataCell>{student.phoneNumber}</CTableDataCell>
              <CTableDataCell>
                <CIcon
                  icon={cilDescription}
                  style={{ color: 'blue', cursor: 'pointer' }}
                  size="lg"
                  onClick={() => handleDetailsClick(student._id)}
                />
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {/* Export Button */}
      <CButton color="success" className="mt-3" onClick={exportToExcel}>
        Export to Excel
      </CButton>
    </>
  )
}

export default TableSection
