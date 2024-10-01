import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import routes from '../routes'
import ApplicantPrivate from '../private-routes/ApplicantPrivate'
import ReceptionistPrivate from '../private-routes/ReceptionistPrivate'
import VisaAdminPrivate from '../private-routes/VisaAdminPrivate'
import CounselorPrivate from '../private-routes/CounselorPrivate'
import AdminPrivate from '../private-routes/AdminPrivate'

const AppContent = () => {
  return (
    <CContainer className="px-4" lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={
                    // Wrap applicant routes with ApplicantPrivate
                    route.name.includes('Applicant') ? (
                      <ApplicantPrivate>
                        <route.element />
                      </ApplicantPrivate>
                    ) : route.name.includes('Admin') ? (
                      <AdminPrivate>
                        <route.element />
                      </AdminPrivate>
                    ) : route.name.includes('Counselor') ? (
                      <CounselorPrivate>
                        <route.element />
                      </CounselorPrivate>
                    ) : route.name.includes('Visa Admin') ? (
                      <VisaAdminPrivate>
                        <route.element />
                      </VisaAdminPrivate>
                    ) : route.name.includes('Receptionist') ?(
                      <ReceptionistPrivate>
                        <route.element />
                      </ReceptionistPrivate>
                    ) 
                    : (
                      <route.element />
                    )
                  }
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to='/login' replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
