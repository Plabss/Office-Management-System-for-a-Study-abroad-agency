/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// StudentDocuments.js
import React, { useState } from 'react';
import { CListGroup, CListGroupItem, CBadge, CButton, CRow, CCol, CFormInput } from '@coreui/react';

const StudentDocuments = ({ documents }) => {
  const [documentFiles, setDocumentFiles] = useState(documents);

  const handleFileUpload = (index, event) => {
    const newDocuments = [...documentFiles];
    newDocuments[index].file = event.target.files[0];
    newDocuments[index].status = 'Uploaded';  // Update status to 'Uploaded' after file is selected
    setDocumentFiles(newDocuments);
  };

  const handleViewDocument = (file) => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  return (
    <CListGroup flush>
      {documentFiles.map((doc, index) => (
        <CListGroupItem key={index}>
          <strong>{doc.name}:</strong> 
          <CRow className="mt-2">
            <CCol md={8}>
              {doc.status === 'Pending' || doc.status === 'Uploaded' ? (
                <CFormInput
                  type="file"
                  onChange={(e) => handleFileUpload(index, e)}
                />
              ) : (
                doc.file ? (
                  <CButton
                    color="info"
                    size="sm"
                    onClick={() => handleViewDocument(doc.file)}
                  >
                    View Document
                  </CButton>
                ) : (
                  <span>No document uploaded yet</span>
                )
              )}
            </CCol>
            <CCol md={4}>
              {doc.status === 'Pending' && (
                <CButton
                  color="primary"
                  onClick={() => handleFileUpload(index)}
                >
                  Upload
                </CButton>
              )}
            </CCol>
          </CRow>
        </CListGroupItem>
      ))}
    </CListGroup>
  );
};

export default StudentDocuments;
