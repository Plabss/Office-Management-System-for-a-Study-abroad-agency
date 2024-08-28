import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import io from 'socket.io-client'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  CBadge,
  useColorModes,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import NotificationList from './NotificationList'
import AppHeaderDropdown from './header/AppHeaderDropdown'

const socket = io(`http://localhost:5000`, {
  transports: ['websocket', 'polling'],
})

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })

    const fetchNotifications = async () => {
      const res = await fetch(`http://localhost:5000/notifications/${JSON.parse(localStorage.getItem('employee'))._id}`)
      const data = await res.json()
      setNotifications(data.data)
    }
    fetchNotifications()
  }, [])

  useEffect(() => {
    socket.on('notification', (data) => {
      if((JSON.parse(localStorage.getItem('employee'))._id) === data.employeeId){
        setNotifications((prevNotifications) => [data, ...prevNotifications])
      }
    })
    return () => {
      socket.off('notification')
    }
  }, [])

  const handleIconClick = () => {
    setShowNotifications(!showNotifications)
  }

  const markAsRead = async (id) => {
    await fetch(`http://localhost:5000/notifications/${id}/read`, {
      method: 'PUT',
    })

    setNotifications(
      notifications.map((notification) => {
        if (notification._id === id) {
          return { ...notification, isRead: true }
        }
        return notification
      }),
    )
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item">
            <CDropdownToggle caret={false}>
              <CIcon icon={cilBell} size="lg" />
              {notifications.filter(notification => !notification.isRead).length > 0 && (
                <CBadge color="danger" shape="rounded-pill" className="position-absolute top-0 end-0">
                  {notifications.filter(notification => !notification.isRead).length}
                </CBadge>
              )}
            </CDropdownToggle>
            <CDropdownMenu className="pt-0" placement="bottom-end">
              <NotificationList notifications={notifications} markAsRead={markAsRead} />
            </CDropdownMenu>
          </CDropdown>

          <CDropdown variant="nav-item">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" />
              ) : (
                <CIcon icon={cilSun} size="lg" />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem onClick={() => setColorMode('light')}>
                <CIcon className="me-2" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem onClick={() => setColorMode('dark')}>
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem onClick={() => setColorMode('auto')}>
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <AppHeaderDropdown />
        </CHeaderNav>

      </CContainer>
    </CHeader>
  )
}

export default AppHeader
