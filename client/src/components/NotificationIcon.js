import React from 'react'
import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'

const NotificationIcon = ({ notifications, onIconClick }) => {
  const unreadCount = notifications.filter(notification => !notification.isRead).length

  return (
    <div className="position-relative d-inline-block">
      <CIcon icon={cilBell} size="lg" onClick={onIconClick} />
      {unreadCount > 0 && (
        <CBadge color="danger" shape="rounded-pill" className="position-absolute top-0 start-100 translate-middle">
          {unreadCount}
        </CBadge>
      )}
    </div>
  )
}

export default NotificationIcon
