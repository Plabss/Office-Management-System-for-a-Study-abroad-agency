import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import axios from 'axios';
import TableSection from '../students/TableSection';

const ViewStudents = () => {
  const [activeTab, setActiveTab] = useState('all-students');
  const [students, setStudents] = useState([]);
  const [employeeID, setEmployeeID] = useState(null);

  useEffect(() => {
    // Fetch employee ID from localStorage
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (employee) {
      console.log('Employee found:', employee); // Debugging log
      setEmployeeID(employee._id);
    } else {
      console.log('No employee found in localStorage'); // Debugging log
    }
  }, []); // Empty dependency array to run this effect only once on mount

  useEffect(() => {
    const fetchStudents = async () => {
      if (!employeeID) {
        console.log('employeeID is null or undefined, skipping fetch'); // Debugging log
        return; // Don't make the API call if employeeID is null
      }

      try {
        console.log('Fetching students with employeeID:', employeeID); // Debugging log
        // Fetch students based on employee ID
        const response = await axios.get(`http://localhost:5000/api/v1/students/get-all-students/${employeeID}`);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [employeeID]); // Dependency array to run this effect whenever employeeID changes

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          {
            console.log(students)
          }
          <CCard>
            <CCardHeader>
              <h2>Students Overview</h2>
            </CCardHeader>
            <CCardBody>
              <CTabs activeItemKey={activeTab}>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink active={activeTab === 'all-students'} onClick={() => setActiveTab('all-students')}>
                      All Students
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'counseling-students'} onClick={() => setActiveTab('counseling-students')}>
                      Counseling Students
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'university-application'} onClick={() => setActiveTab('university-application')}>
                      University Application Students
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'visa-application'} onClick={() => setActiveTab('visa-application')}>
                      Visa Application Students
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane visible={activeTab === 'all-students'}>
                    <TableSection data={students} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'counseling-students'}>
                    <TableSection data={students.filter(student => student.employees?.asCounselor?.includes(employeeID))} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'university-application'}>
                    <TableSection data={students.filter(student => student.employees?.asApplicant?.includes(employeeID))} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'visa-application'}>
                    <TableSection data={students.filter(student => student.employees?.asVisaAdmin?.includes(employeeID))} />
                  </CTabPane>
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ViewStudents;
