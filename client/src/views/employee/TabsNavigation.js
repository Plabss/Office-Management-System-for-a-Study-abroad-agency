/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import { CNav, CNavItem, CNavLink } from '@coreui/react';

const TabsNavigation = ({ activeTab, onTabChange }) => (
  <CNav variant="tabs">
    <CNavItem>
      <CNavLink active={activeTab === 'basic-info'} onClick={() => onTabChange('basic-info')}>
        Basic Information
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink active={activeTab === 'counseling-students'} onClick={() => onTabChange('counseling-students')}>
        Counseling Students
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink active={activeTab === 'university-application'} onClick={() => onTabChange('university-application')}>
        University Application Students
      </CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink active={activeTab === 'visa-application'} onClick={() => onTabChange('visa-application')}>
        Visa Application Students
      </CNavLink>
    </CNavItem>
  </CNav>
);

export default TabsNavigation;
