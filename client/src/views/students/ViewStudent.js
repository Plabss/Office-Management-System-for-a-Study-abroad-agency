/* eslint-disable prettier/prettier */
// ViewStudent.js
import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCol, CContainer, CRow, CTabs, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react';
import StudentInfo from './StudentInfo';
import StudentProgress from './StudentProgress';
import StudentDocuments from './StudentDocuments';
import StudentCourses from './StudentCourses';
import VisaUploads from './VisaUploads';

const ViewStudent = () => {
  const [activeTab, setActiveTab] = useState('basic-info');

  // Fake student data
  const student = {
    studentId: 'STU00123',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '+1234567890',
    parentPhone: '+0987654321',
    dob: '2000-01-01',
    street: '1234 Elm Street',
    city: 'Metropolis',
    postalCode: '123456',
    country: 'USA',
    howKnow: 'Internet Search',
  };

  // Fake progress data
  const progress = {
    coursesCompleted: 8,
    currentGPA: 3.8,
    upcomingExams: [
      { course: 'Math 101', date: '2024-08-10' },
      { course: 'Physics 201', date: '2024-08-15' },
    ],
  };
  
  const counselor = 'Dr. John Doe';
  const applicant = 'Jane Smith';
  const visaOfficer = 'Mr. Alan Brown';

  // Fake documents data
  const documents = [
    { name: 'Transcript', status: 'Verified', file: new File([''], 'transcript.pdf') },
    { name: 'ID Card', status: 'Pending', file: null },
    { name: 'Passport', status: 'Pending', file: null },
    { name: 'Recommendation Letter', status: 'Pending', file: null },
    { name: 'Personal Statement', status: 'Pending', file: null },
  ];
    

  // Fake courses data
  const courses = [
    { name: 'Math 101', applied: 'Yes', documents: 'Math101_Doc.pdf' },
    { name: 'Physics 201', applied: 'No', documents: 'Physics201_Doc.pdf' },
    { name: 'Chemistry 301', applied: 'Yes', documents: 'Chemistry301_Doc.pdf' },
  ];

  // Fake visa upload data
  const visa = [
    { country: 'USA', course: 'Math 101', status: 'Pending', document: '' },
    { country: 'USA', course: 'Physics 201', status: 'Accepted', document: 'Physics201_View.pdf' },
    { country: 'USA', course: 'Chemistry 301', status: 'Pending', document: '' },
    { country: 'USA', course: 'Biology 401', status: 'Accepted', document: 'Biology401_View.pdf' },
    { country: 'USA', course: 'History 501', status: 'Rejected', document: 'History501_View.pdf' },
  ];
  

  
  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Student Details</h2>
            </CCardHeader>
            <CCardBody>
              <CTabs activeItemKey={activeTab}>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink active={activeTab === 'basic-info'} onClick={() => setActiveTab('basic-info')}>
                      Basic Info
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'progress'} onClick={() => setActiveTab('progress')}>
                      Progress
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
                      Documents
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'courses'} onClick={() => setActiveTab('courses')}>
                      Courses
                    </CNavLink>
                  </CNavItem>
                  <CNavItem>
                    <CNavLink active={activeTab === 'visa'} onClick={() => setActiveTab('visa')}>
                      Visa
                    </CNavLink>
                  </CNavItem>
                </CNav>
                <CTabContent>
                  <CTabPane visible={activeTab === 'basic-info'}>
                    <StudentInfo student={student} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'progress'}>
                    <StudentProgress progress={progress} counselor={counselor} applicant={applicant} visaOfficer={visaOfficer} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'documents'}>
                    <StudentDocuments documents={documents} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'courses'}>
                    <StudentCourses courses={courses} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'visa'}>
                    <VisaUploads visa={visa} />
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

export default ViewStudent;
