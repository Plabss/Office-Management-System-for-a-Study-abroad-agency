import React from 'react'
import { CCard, CCardBody, CCardHeader, CCardText, CButton } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle } from '@coreui/icons'

import './NotificationList.css'
import { useDispatch } from 'react-redux'

const NotificationList = ({ notifications, markAsRead }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleRowClick = (studentId) => {
    localStorage.setItem('studentId', studentId)
    dispatch({ type: 'toggleElement', key: 'notificationClick' })
    navigate(`/view-student`)
  }

  return (
    <CCard className=" notification-card" style={{"width":"500px"}}>
      <CCardHeader>
        <h5 className="m-0">Notifications</h5>
      </CCardHeader>
      <CCardBody className="notification-body">
        {notifications.length === 0 ? (
          <p className="text-center text-muted">No notifications</p>
        ) : (
          notifications.map(notification => (
            <div
              key={notification._id}
              className={`d-flex justify-content-between align-items-center p-2 mb-2 rounded notification-item ${notification.isRead ? 'bg-light' : 'bg-warning-light'}`}
              onClick={() => handleRowClick(notification.studentId)}
            >
              <CCardText className="m-0 notification-text">{notification.message}</CCardText>
              {!notification.isRead && (
                <CButton
                  color="primary"
                  size="sm"
                  className="mark-read-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(notification._id)
                  }}
                >
                  <CIcon icon={cilCheckCircle} />
                </CButton>
              )}
            </div>
          ))
        )}
      </CCardBody>
    </CCard>
  )
}

export default NotificationList
