import { CButton, CFormLabel, CListGroup, CListGroupItem } from '@coreui/react'
import React from 'react'

const BasicInformationContent = ({ employee }) => {
  return (
    <div className="mt-4">
      <p>Name: {employee.name}</p>
      <p>Email: {employee.email}</p>
      <p>Phone: {employee.phone}</p>
      <CButton color="info" onClick={() => window.open(employee.cv, '_blank')}>
        View CV
      </CButton>
      <br></br>
      <CButton className="mt-4" color="info" onClick={() => window.open(employee.nid, '_blank')}>
        View NID
      </CButton>

      <div className='mt-2'>
        <CFormLabel>Roles</CFormLabel>
        <CListGroup>
          {employee?.role?.map((r, index) => (
            <CListGroupItem key={index}>
              {r}
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleRemoveRole(r)}
                className="float-end"
              >
                Remove
              </CButton>
            </CListGroupItem>
          ))}
        </CListGroup>
      </div>
    </div>
  )
}

export default BasicInformationContent
