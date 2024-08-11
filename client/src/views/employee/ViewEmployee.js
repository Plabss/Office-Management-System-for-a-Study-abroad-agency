import React, { useState } from 'react';
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
import BasicInformationContent from './BasicInformationContent'; // Import the new component

import avatar1 from 'src/assets/images/avatars/1.jpg';
import avatar2 from 'src/assets/images/avatars/2.jpg';
import avatar3 from 'src/assets/images/avatars/3.jpg';
import avatar4 from 'src/assets/images/avatars/4.jpg';
import avatar5 from 'src/assets/images/avatars/5.jpg';
import avatar6 from 'src/assets/images/avatars/6.jpg';
import { cifUs, cifBr, cifIn, cifFr, cifEs, cifPl, cilPeople } from '@coreui/icons';

const tableData = [
  {
    avatar: { src: avatar1, status: 'success' },
    user: { name: 'Yiorgos Avraamu', new: true, registered: 'Jan 1, 2023' },
    country: { name: 'USA', flag: cifUs },
    usage: { value: 50, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'success' },
    payment: { name: 'Mastercard', icon: cilPeople },
    activity: '10 sec ago',
  },
  // Add more data as needed
];

const ViewEmployee = () => {
  const [activeTab, setActiveTab] = useState('basic-info');

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Employee Details</h2>
            </CCardHeader>
            <CCardBody>
              <CTabs activeItemKey={activeTab}>
                <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />
                <CTabContent>
                  <CTabPane visible={activeTab === 'basic-info'}>
                    <BasicInformationContent />
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

export default ViewEmployee;
