/* eslint-disable prettier/prettier */
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
    {
      avatar: { src: avatar2, status: 'danger' },
      user: { name: 'Avram Tarasios', new: false, registered: 'Jan 1, 2023' },
      country: { name: 'Brazil', flag: cifBr },
      usage: { value: 22, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'info' },
      payment: { name: 'Visa', icon: cilPeople },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'India', flag: cifIn },
      usage: { value: 74, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'warning' },
      payment: { name: 'Stripe', icon: cilPeople },
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'Enéas Kwadwo', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'France', flag: cifFr },
      usage: { value: 98, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'danger' },
      payment: { name: 'PayPal', icon: cilPeople },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: { name: 'Agapetus Tadeáš', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'Spain', flag: cifEs },
      usage: { value: 22, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'primary' },
      payment: { name: 'Google Wallet', icon: cilPeople },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: { name: 'Friderik Dávid', new: true, registered: 'Jan 1, 2023' },
      country: { name: 'Poland', flag: cifPl },
      usage: { value: 43, period: 'Jun 11, 2023 - Jul 10, 2023', color: 'success' },
      payment: { name: 'Amex', icon: cilPeople },
      activity: 'Last week',
    },
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
                    <div>Basic Information Content</div>
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
