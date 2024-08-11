import React from 'react'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../navigations/_nav'
import CounselorNavigation from '../navigations/_counselorNav'
import ReceptionistNavigation from '../navigations/_receptionistNav'
import ApplicantNavigation from '../navigations/_applicantNav'
import VisaAdminNavigation from '../navigations/_visaAdminNav'
import { useDispatch, useSelector } from 'react-redux'


const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  // const role = 'counselor';
  const role = localStorage.getItem('role');

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon customClassName="sidebar-brand-full" icon={logo} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      {
        role === 'super-admin' ? <AppSidebarNav items={navigation} /> :
        role === 'counselor' ? <AppSidebarNav items={CounselorNavigation} /> :
        role === 'applicant' ? <AppSidebarNav items={ApplicantNavigation} /> :
        role === 'visa-admin' ? <AppSidebarNav items={VisaAdminNavigation} /> :
        role === 'receptionist' ? <AppSidebarNav items={ReceptionistNavigation} /> : null
      }
      
      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
