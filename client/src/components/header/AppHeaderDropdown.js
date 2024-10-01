import React, { useEffect, useState } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilEnvelopeOpen,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useDispatch } from 'react-redux'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const Employee = localStorage.getItem('employee');
        setEmployee(JSON.parse(Employee));
        console.log("employee, " + Employee);
      } catch (error) {
        
      }
    }

    fetchEmployee()
  }, [])
  
  const handleLogout = () => {
    // Remove the role from localStorage
    localStorage.removeItem('role');
    localStorage.removeItem('activeTab');
    

    // Redirect to the login page
    navigate('/');
  }
  const handleViewProfile = () => {
    // Remove the role from localStorage
    // localStorage.setItem('employeeId', null);
    const employee = JSON.parse(localStorage.getItem('employee'))
    // Redirect to the login page
    localStorage.setItem('employeeId',employee._id)
    navigate('/view-employee');
    dispatch({ type: 'toggleElement', key: 'viewMyProfile' })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={employee?.img} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem href="#" style={{ cursor: 'pointer' }}>
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#" style={{ cursor: 'pointer' }}>
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem onClick={handleViewProfile} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
