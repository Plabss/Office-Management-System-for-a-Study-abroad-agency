import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAvatar,
  CPagination,
  CPaginationItem, // Import pagination components
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronBottom, cilPeople, cilUser } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewEmployees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  useEffect(() => {
    fetchAllEmployees(currentPage); // Fetch employees when the component mounts and when page changes
  }, [currentPage]); // Add currentPage as a dependency

  const fetchAllEmployees = async (page) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/employees/get-all-employees`, {
        params: { page, limit: 2 }, // Send page and limit for pagination
      });
      const { employees, totalPages } = response.data;
      setEmployees(employees);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page state
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Employee List</h4>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" hover responsive className="border">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    <CIcon icon={cilUser} />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Email</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Phone</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Role</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Details</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {employees.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="text-center align-middle">
                      <CAvatar size="md" src={item.avatar || '/default-avatar.png'} />
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.name}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.email}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.phone}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.role.join(', ')}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <CIcon icon={cilChevronBottom} size="lg" onClick={() => {
                        navigate('/view-employee');
                        localStorage.setItem('employeeId', item._id);
                      }} />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Pagination Controls */}
            <CPagination align="center" className="mt-4">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </CPaginationItem>
              {[...Array(totalPages).keys()].map((_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewEmployees;
