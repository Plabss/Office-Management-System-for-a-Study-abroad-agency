/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// TableSection.js
import React from 'react';
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAvatar,
  CProgress,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople } from '@coreui/icons';
import { Link } from 'react-router-dom';

const TableSection = ({ data }) => (
  <CTable align="middle" className="mb-0 border" hover responsive>
    <CTableHead className="text-nowrap">
      <CTableRow>
        <CTableHeaderCell className="bg-body-tertiary text-center">
          <CIcon icon={cilPeople} />
        </CTableHeaderCell>
        <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
        <CTableHeaderCell className="bg-body-tertiary text-center">Country</CTableHeaderCell>
        <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
        <CTableHeaderCell className="bg-body-tertiary text-center">Payment Method</CTableHeaderCell>
        <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
        <CTableHeaderCell className="bg-body-tertiary">Details</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {data.map((item, index) => (
        <CTableRow key={index}>
          <CTableDataCell className="text-center">
            <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
          </CTableDataCell>
          <CTableDataCell>
            <div>{item.user.name}</div>
            <div className="small text-body-secondary text-nowrap">
              <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered: {item.user.registered}
            </div>
          </CTableDataCell>
          <CTableDataCell className="text-center">
            <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
          </CTableDataCell>
          <CTableDataCell>
            <div className="d-flex justify-content-between text-nowrap">
              <div className="fw-semibold">{item.usage.value}%</div>
              <div className="ms-3">
                <small className="text-body-secondary">{item.usage.period}</small>
              </div>
            </div>
            <CProgress thin color={item.usage.color} value={item.usage.value} />
          </CTableDataCell>
          <CTableDataCell className="text-center">
            <CIcon size="xl" icon={item.payment.icon} />
          </CTableDataCell>
          <CTableDataCell>
            <div className="small text-body-secondary text-nowrap">Last login</div>
            <div className="fw-semibold text-nowrap">{item.activity}</div>
          </CTableDataCell>
          <CTableDataCell>
            <div className="fw-semibold text-nowrap"><Link to={"/view-student"}>Go</Link></div>
          </CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
);

export default TableSection;
