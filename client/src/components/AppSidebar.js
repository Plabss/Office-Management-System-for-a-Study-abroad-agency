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
import pixelCode from '../assets/brand/pixelCode.png'

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
  const role = JSON.parse(localStorage.getItem('employee')).role[0]
  return (
    <CSidebar
      className="border-end"
      colorScheme="light"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" style={{"text-decoration":"none"}}>
          <div style={{"display":"flex","alignItems":"center"}}>
          <img
            src={pixelCode}
            alt=""
            style={{
              height: '70px',
              width: '60px',
              borderRadius: '15px',
              padding: '10px 0px 10px 0px',
            }}
          />
          <h5 style={{"margin-left":"0.5rem"}}>Pixel Code</h5>
          </div>
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      {console.log('role', role)}

      {role === 'super-admin' ? (
        <AppSidebarNav items={navigation} />
      ) : role === 'counselor' ? (
        <AppSidebarNav items={CounselorNavigation} />
      ) : role === 'applicant' ? (
        <AppSidebarNav items={ApplicantNavigation} />
      ) : role === 'visa-admin' ? (
        <AppSidebarNav items={VisaAdminNavigation} />
      ) : role === 'receptionist' ? (
        <AppSidebarNav items={ReceptionistNavigation} />
      ) : null}

      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
