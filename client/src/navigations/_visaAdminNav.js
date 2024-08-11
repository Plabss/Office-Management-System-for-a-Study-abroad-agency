import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPlus,
  cilMagnifyingGlass,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const VisaAdminNavigation = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/visa-admin-dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Visitor',
  },
  {
    component: CNavItem,
    name: 'Add Visitor',
    to: '/visa-admin-add-visitor',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Visitors',
    to: '/visa-admin-view-visitors',
    icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Student',
  },
  {
    component: CNavItem,
    name: 'Add Student',
    to: '/visa-admin-add-student',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Students',
    to: '/visa-admin-view-students',
    icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
  },
//   {
//     component: CNavTitle,
//     name: 'Employee',
//   },
//   {
//     component: CNavItem,
//     name: 'Add Employee',
//     to: '/admin-add-employee',
//     icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
//   },
//   {
//     component: CNavItem,
//     name: 'View Employees',
//     to: '/admin-view-employees',
//     icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
//   },
]

export default VisaAdminNavigation
