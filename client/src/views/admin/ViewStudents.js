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
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    // Fetch employee ID from localStorage
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (employee) {
      console.log('Employee found:', employee); // Debugging log
      setEmployeeId(employee._id);
    } else {
      console.log('No employee found in localStorage'); // Debugging log
    }
  }, []); // Empty dependency array to run this effect only once on mount

  useEffect(() => {
    const fetchStudents = async () => {
      if (!employeeId) {
        console.log('employeeID is null or undefined, skipping fetch'); // Debugging log
        return; // Don't make the API call if employeeID is null
      }

      try {
        console.log('Fetching students with employeeID:', employeeId); // Debugging log
        // Fetch students based on employee ID
        const response = await axios.get(`http://localhost:5000/api/v1/students/get-all-students/${employeeId}`);
        console.log("ggggggggggggg",response.data);
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, [employeeId]); // Dependency array to run this effect whenever employeeID changes

  // Helper function to get unique students based on a given filter
  const getUniqueStudents = (filteredStudents) => {
    const studentMap = new Map();
    filteredStudents.forEach(student => {
      if (!studentMap.has(student._id)) {
        studentMap.set(student._id, student);
      }
    });
    return Array.from(studentMap.values());
  };

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
                    <TableSection data={getUniqueStudents(students)} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'counseling-students'}>
                    <TableSection data={getUniqueStudents(students.filter(student => student.employees?.asCounselor?.includes(employeeId)))} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'university-application'}>
                    {
                      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxx",students.filter(student => student.employees?.asApplicant?.includes(employeeId)))
                    }
                    <TableSection data={getUniqueStudents(students.filter(student => student.employees?.asApplicant?.includes(employeeId)))} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'visa-application'}>
                    <TableSection data={getUniqueStudents(students.filter(student => student.employees?.asVisaAdmin?.includes(employeeId)))} />
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
