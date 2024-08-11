// VisaUploads.js
import React from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CBadge, CFormInput } from '@coreui/react';
import axios from 'axios';

const VisaUploads = ({ visaUploads, onUpdateVisa }) => {
  const handleFileUpload = (index, event) => {
    const newVisaUploads = [...visaUploads];
    newVisaUploads[index].document = event.target.files[0].name;
    newVisaUploads[index].file = event.target.files[0]; // Storing the actual file object
    newVisaUploads[index].status = 'Accepted'; 
    onUpdateVisa(newVisaUploads);
  };

  const handleUploadClick = async (index) => {
    const uploadData = visaUploads[index];
    if (!uploadData.file) {
      console.log("No file selected for upload");
      return;
    }

    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('country', uploadData.country);
    formData.append('course', uploadData.course);

    try {
      const response = await axios.post('/api/visa-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File uploaded successfully:', response.data);

      // Update status to reflect success or failure
      const updatedVisaUploads = [...visaUploads];
      updatedVisaUploads[index].status = 'Uploaded';
      onUpdateVisa(updatedVisaUploads);

    } catch (error) {
      console.error('Error uploading file:', error);

      // Update status to reflect the failure
      const updatedVisaUploads = [...visaUploads];
      updatedVisaUploads[index].status = 'Failed';
      onUpdateVisa(updatedVisaUploads);
    }
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
              <CBadge color={upload.status === 'Uploaded' ? 'success' : upload.status === 'Failed' ? 'danger' : 'warning'}>
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
