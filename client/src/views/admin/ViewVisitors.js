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

const ViewVisitors = () => {
  const navigate = useNavigate();

  const [visitors, setVisitors] = useState([]);

  useEffect(() => {
    const fetchAllVisitors = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/visitors/get-all-visitors`,
        )
        const visitorList = response.data
        console.log("visitorList",visitorList)
        setVisitors(visitorList)
      } catch (error) {
        console.error('Error fetching visitor list:', error)
      }
    }

    fetchAllVisitors();
  }, []);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Visitor List</h4>
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
                  <CTableHeaderCell className="text-center bg-body-tertiary">Interested Countries</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Intake</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {visitors.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="text-center align-middle">
                      <CIcon icon={cilPeople} />
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
                      <div className="font-weight-bold">{item.interestedCountries}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <CIcon icon={cilChevronBottom} size="lg" onClick={() => {
                        navigate('/view-visitor');
                        localStorage.setItem('visitorId', item._id);
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

export default ViewVisitors;
