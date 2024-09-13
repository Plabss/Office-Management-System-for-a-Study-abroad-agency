import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CPagination,
  CPaginationItem,
  CTabs,
  CTabContent,
  CTabPane,
} from '@coreui/react';
import TableSection from './TableSection';
import TabsNavigation from './TabsNavigation';
import BasicInformationContent from './BasicInformationContent'; 
import axios from 'axios';
import { useSelector } from 'react-redux';

const ITEMS_PER_PAGE = 2; // Number of items per page

const ViewEmployee = () => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [employee, setEmployee] = useState(null);  
  const [currentPage, setCurrentPage] = useState({
    counselingPage: 1,
    applicantPage: 1,
    visaAdminPage: 1,
  });

  const employeeId = localStorage.getItem('employeeId');
  const viewMyProfile = useSelector((state) => state.viewMyProfile);
  const updateRole = useSelector((state) => state.updateRole);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!employeeId) {
        console.error('No employeeId found in localStorage');
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/employees/get-a-employee/${employeeId}`
        );
        setEmployee(response.data);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId, viewMyProfile, updateRole]);

  // Get paginated data for each tab
  const getPaginatedData = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  // Get total pages for each tab
  const getTotalPages = (data) => {
    return Math.ceil(data.length / ITEMS_PER_PAGE);
  };

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
                      <TableSection data={getPaginatedData(employee?.students?.asCounselor, currentPage.counselingPage)} />
                      <CPagination className="mt-3">
                        <CPaginationItem
                          disabled={currentPage.counselingPage === 1}
                          onClick={() => setCurrentPage((prev) => ({ ...prev, counselingPage: prev.counselingPage - 1 }))}
                        >
                          Previous
                        </CPaginationItem>
                        {[...Array(getTotalPages(employee?.students?.asCounselor)).keys()].map((_, index) => (
                          <CPaginationItem
                            key={index + 1}
                            active={currentPage.counselingPage === index + 1}
                            onClick={() => setCurrentPage((prev) => ({ ...prev, counselingPage: index + 1 }))}
                          >
                            {index + 1}
                          </CPaginationItem>
                        ))}
                        <CPaginationItem
                          disabled={currentPage.counselingPage === getTotalPages(employee?.students?.asCounselor)}
                          onClick={() => setCurrentPage((prev) => ({ ...prev, counselingPage: prev.counselingPage + 1 }))}
                        >
                          Next
                        </CPaginationItem>
                      </CPagination>
                    </CTabPane>
                    <CTabPane visible={activeTab === 'university-application'}>
                      <TableSection data={getPaginatedData(employee?.students?.asApplicant, currentPage.applicantPage)} />
                      <CPagination className="mt-3">
                        <CPaginationItem
                          disabled={currentPage.applicantPage === 1}
                          onClick={() => setCurrentPage((prev) => ({ ...prev, applicantPage: prev.applicantPage - 1 }))}
                        >
                          Previous
                        </CPaginationItem>
                        {[...Array(getTotalPages(employee?.students?.asApplicant)).keys()].map((_, index) => (
                          <CPaginationItem
                            key={index + 1}
                            active={currentPage.applicantPage === index + 1}
                            onClick={() => setCurrentPage((prev) => ({ ...prev, applicantPage: index + 1 }))}
                          >
                            {index + 1}
                          </CPaginationItem>
                        ))}
                        <CPaginationItem
                          disabled={currentPage.applicantPage === getTotalPages(employee?.students?.asApplicant)}
                          onClick={() => setCurrentPage((prev) => ({ ...prev, applicantPage: prev.applicantPage + 1 }))}
                        >
                          Next
                        </CPaginationItem>
                      </CPagination>
                    </CTabPane>
                    <CTabPane visible={activeTab === 'visa-application'}>
                      <TableSection data={getPaginatedData(employee?.students?.asVisaAdmin, currentPage.visaAdminPage)} />
                      <CPagination className="mt-3">
                        <CPaginationItem
                          disabled={currentPage.visaAdminPage === 1}
                          onClick={() => setCurrentPage((prev) => ({ ...prev, visaAdminPage: prev.visaAdminPage - 1 }))}
                        >
                          Previous
                        </CPaginationItem>
                        {[...Array(getTotalPages(employee?.students?.asVisaAdmin)).keys()].map((_, index) => (
                          <CPaginationItem
                            key={index + 1}
                            active={currentPage.visaAdminPage === index + 1}
                            onClick={() => setCurrentPage((prev) => ({ ...prev, visaAdminPage: index + 1 }))}
                          >
                            {index + 1}
                          </CPaginationItem>
                        ))}
                        <CPaginationItem
                          disabled={currentPage.visaAdminPage === getTotalPages(employee?.students?.asVisaAdmin)}
                          onClick={() => setCurrentPage((prev) => ({ ...prev, visaAdminPage: prev.visaAdminPage + 1 }))}
                        >
                          Next
                        </CPaginationItem>
                      </CPagination>
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
