import React, { useState } from 'react';
import axios from 'axios';
import { CListGroup, CListGroupItem, CButton, CRow, CCol, CFormInput, CSpinner } from '@coreui/react';

const StudentDocuments = ({ documents, onDocumentUpload }) => {
  const [documentFiles, setDocumentFiles] = useState(documents);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (index, event) => {
    const newDocuments = [...documentFiles];
    newDocuments[index].file = event.target.files[0];
    setDocumentFiles(newDocuments);
  };

  const handleUpload = async (index) => {
    const file = documentFiles[index].file;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', documentFiles[index].name);

    try {
      setUploading(true);
      // Replace with your actual API endpoint
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update document status to 'Uploaded' and pass the updated document back to the parent
      const updatedDocument = { ...documentFiles[index], status: 'Uploaded' };
      onDocumentUpload(index, updatedDocument);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
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
          <CRow className="mt-2 align-items-center">
            <CCol md={8} className="d-flex align-items-center">
              {doc.status === 'Pending' || doc.status === 'Uploaded' ? (
                <>
                  <CFormInput
                    type="file"
                    onChange={(e) => handleFileChange(index, e)}
                    disabled={uploading}
                    style={{ flex: 1 }}
                  />
                  {doc.status === 'Pending' && (
                    <CButton
                      color="primary"
                      onClick={() => handleUpload(index)}
                      disabled={uploading}
                      className="mx-4"
                    >
                      {uploading ? <CSpinner size="sm" /> : 'Upload'}
                    </CButton>
                  )}
                </>
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
          </CRow>
        </CListGroupItem>
      ))}
    </CListGroup>
  );
};

export default StudentDocuments;
