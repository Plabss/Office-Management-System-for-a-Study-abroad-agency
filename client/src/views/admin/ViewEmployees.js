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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChevronBottom, cilPeople } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewEmployees = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([
    {
      name: 'Fake',
      email: 'fake@gmail.com',
      phone: '09182763',
      avatar: '',
      role: ['counselor'],
      cv: 'abul_cv.pdf',
      nid: '1234567890',
      _id: '1',
    },
    // more employees fetched from an API
  ]);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/employees/get-all-employees`,
        )
        const employeeList = response.data
        console.log("employeeList",employeeList)
        setEmployees(employeeList)
      } catch (error) {
        console.error('Error fetching course details:', error)
      }
    }

    fetchAllEmployees();
  }, []);

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
                    <CIcon icon={cilPeople} />
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
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewEmployees;
