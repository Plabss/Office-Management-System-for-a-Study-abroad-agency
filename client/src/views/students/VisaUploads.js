/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// VisaUploads.js
import React, { useState } from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CBadge, CFormInput, CForm } from '@coreui/react';

const VisaUploads = ({ visa }) => {
  const [visaUploads, setVisaUploads] = useState(visa);

  const handleFileUpload = (index, event) => {
    const newVisaUploads = [...visaUploads];
    newVisaUploads[index].document = event.target.files[0].name;
    newVisaUploads[index].status = 'Accepted'; // Change status to 'Accepted' after selecting a file
    setVisaUploads(newVisaUploads);
  };

  const handleUploadClick = (index) => {
    // You can add custom logic here for when the upload button is clicked
    console.log(`Uploading file for index ${index}`);
  };

  return (
    <CTable hover>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>Country</CTableHeaderCell>
          <CTableHeaderCell>Course</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Document</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {visaUploads.map((upload, index) => (
          <CTableRow key={index}>
            <CTableDataCell>{upload.country}</CTableDataCell>
            <CTableDataCell>{upload.course}</CTableDataCell>
            <CTableDataCell>
              <CBadge color={upload.status === 'Accepted' ? 'success' : upload.status === 'Rejected' ? 'danger' : 'warning'}>
                {upload.status}
              </CBadge>
            </CTableDataCell>
            <CTableDataCell>
              {upload.status === 'Pending' ? (
                <div className="d-flex align-items-center">
                  <CFormInput
                    type="file"
                    onChange={(e) => handleFileUpload(index, e)}
                    className="me-2"
                  />
                  <CButton color="primary" onClick={() => handleUploadClick(index)}>
                    Upload
                  </CButton>
                </div>
              ) : (
                <CButton color="info" href={upload.document} target="_blank">
                  View
                </CButton>
              )}
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
};

export default VisaUploads;
