import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTabs,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import TableSection from './TableSection';
import TabsNavigation from './TabsNavigation';
import BasicInformationContent from './BasicInformationContent'; 
import axios from 'axios';
import { useSelector } from 'react-redux';

const ViewEmployee = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [employee, setEmployee] = useState(null);  // Default to null instead of an empty array
  const employeeId = localStorage.getItem('employeeId');
  const viewMyProfile = useSelector((state) => state.viewMyProfile)
  const updateRole = useSelector((state) => state.updateRole)
  useEffect(() => {
      // Directly get the employeeId as a string
    const fetchEmployeeDetails = async () => {
      if (!employeeId) {
        console.error('No employeeId found in localStorage');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/employees/get-a-employee/${employeeId}`,
        );
        const employeeData = response.data;
        console.log("employeeData", employeeData);
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };
    fetchEmployeeDetails();
  }, [employeeId,viewMyProfile,updateRole]);

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Employee Details</h2>
            </CCardHeader>
            <CCardBody>
              {employee && (
                <CTabs activeItemKey={activeTab}>
                  <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                  <CTabContent>
                    <CTabPane visible={activeTab === 'basic-info'}>
                      <BasicInformationContent employee={employee} />
                    </CTabPane>
                    <CTabPane visible={activeTab === 'counseling-students'}>
                      <TableSection data={employee?.students?.asCounselor} />
                    </CTabPane>
                    <CTabPane visible={activeTab === 'university-application'}>
                      <TableSection data={employee?.students?.asApplicant} />
                    </CTabPane>
                    <CTabPane visible={activeTab === 'visa-application'}>
                      <TableSection data={employee?.students?.asVisaAdmin} />
                    </CTabPane>
                  </CTabContent>
                </CTabs>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default ViewEmployee;
