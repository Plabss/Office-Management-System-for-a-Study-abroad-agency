import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilPlus,
  cilMagnifyingGlass,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const ReceptionistNavigation = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/receptionist-dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Visitor',
  },
  {
    component: CNavItem,
    name: 'Add Visitor',
    to: '/receptionist-add-visitor',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Visitors',
    to: '/receptionist-view-visitors',
    icon: <CIcon icon={cilMagnifyingGlass} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Student',
  },
  {
    component: CNavItem,
    name: 'Add Student',
    to: '/receptionist-add-student',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'View Students',
    to: '/receptionist-view-students',
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

export default ReceptionistNavigation
