import React, { useState } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell, CPagination, CPaginationItem, CCard } from '@coreui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react';
import { cilDescription } from '@coreui/icons';

const StudentsList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { students, title } = location.state || { students: [], title: 'Students' };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of students to display per page

  // Calculate total pages
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // Slice students data for the current page
  const paginatedStudents = students.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDetailsClick = (studentId) => {
    localStorage.setItem('studentId', studentId);
    navigate('/view-student');
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  return (
    <CCard className="shadow-sm" style={{"padding":"1rem"}}>
      <h2>{title}</h2>
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
          {paginatedStudents.map((student, index) => (
            <CTableRow key={index}>
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

      {/* Pagination Controls */}
      <CPagination align="center" className="mt-3">
        <CPaginationItem
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </CPaginationItem>

        {[...Array(totalPages).keys()].map((number) => (
          <CPaginationItem
            key={number + 1}
            active={currentPage === number + 1}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </CPaginationItem>
        ))}

        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </CPaginationItem>
      </CPagination>
    </CCard>
  )
}

export default StudentsList
