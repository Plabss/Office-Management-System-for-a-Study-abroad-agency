// ViewStudents.js
import React, { useState } from 'react';
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

import avatar1 from 'src/assets/images/avatars/1.jpg';
import avatar2 from 'src/assets/images/avatars/2.jpg';
import avatar3 from 'src/assets/images/avatars/3.jpg';
import avatar4 from 'src/assets/images/avatars/4.jpg';
import avatar5 from 'src/assets/images/avatars/5.jpg';
import avatar6 from 'src/assets/images/avatars/6.jpg';
import { cifUs, cifBr, cifIn, cifFr, cifEs, cifPl, cilPeople } from '@coreui/icons';
import TableSection from '../students/TableSection';

const tableData = [
  {
    avatar: { src: avatar1, status: 'success' },
    user: { name: 'Yiorgos Avraamu', new: true, registered: 'Jan 1, 2023' },
    country: { name: 'USA', flag: cifUs },
    usage: { value: 50, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'success' },
    payment: { name: 'Mastercard', icon: cilPeople },
    activity: '10 sec ago',
  },
  {
    avatar: { src: avatar2, status: 'danger' },
    user: { name: 'Avram Tarasios', new: false, registered: 'Jan 1, 2023' },
    country: { name: 'Brazil', flag: cifBr },
    usage: { value: 22, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'info' },
    payment: { name: 'Visa', icon: cilPeople },
    activity: '5 minutes ago',
  },
  // ... add more items as needed
];

const ViewStudents = () => {
  const [activeTab, setActiveTab] = useState('all-students');

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
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
                    <TableSection data={tableData} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'counseling-students'}>
                    <TableSection data={tableData} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'university-application'}>
                    <TableSection data={tableData} />
                  </CTabPane>
                  <CTabPane visible={activeTab === 'visa-application'}>
                    <TableSection data={tableData} />
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
