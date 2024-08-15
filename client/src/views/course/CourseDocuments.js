import React, { useState } from 'react';
import axios from 'axios';
import { CListGroup, CListGroupItem, CButton, CRow, CCol, CFormInput, CSpinner } from '@coreui/react';
import { useSelector } from 'react-redux';

const StudentDocuments = ({ documents, onDocumentUpload }) => {
  const [uploading, setUploading] = useState({ file1: false, file2: false, file3: false });

  const courseId = useSelector(state => state.courseId);

  const handleFileChange = (docType, event) => {
    const updatedDocument = { ...documents, [docType]: event.target.files[0] };
    onDocumentUpload(updatedDocument);
  };

  const handleUpload = async (docType) => {
    const file = documents[docType];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file); // Ensure the key is 'file' as per backend expectation
    formData.append('documentName', docType);

    try {
      setUploading({ ...uploading, [docType]: true });
      // Replace with your actual API endpoint
      await axios.post(`http://localhost:5000/api/v1/courses/upload-document/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update document status to 'Uploaded'
      onDocumentUpload({ ...documents, [docType]: 'Uploaded' });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading({ ...uploading, [docType]: false });
    }
  };

  const handleViewDocument = (file) => {
    if (typeof file === 'string') {
      window.open(file, '_blank');
    } else if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  return (
    <CListGroup flush>

      {
        console.log(courseId, 'Course')
      }
      {['file1', 'file2', 'file3'].map((docType) => (
        <CListGroupItem key={docType}>
          <strong>{docType.toUpperCase()}:</strong>
          <CRow className="mt-2 align-items-center">
            <CCol md={8} className="d-flex align-items-center">
              {documents[docType] && typeof documents[docType] === 'string' ? (
                <CButton
                  color="info"
                  size="sm"
                  onClick={() => handleViewDocument(documents[docType])}
                >
                  View Document
                </CButton>
              ) : (
                <>
                  <CFormInput
                    type="file"
                    onChange={(e) => handleFileChange(docType, e)}
                    disabled={uploading[docType]}
                    style={{ flex: 1 }}
                  />
                  <CButton
                    color="primary"
                    onClick={() => handleUpload(docType)}
                    disabled={uploading[docType]}
                    className="mx-4"
                  >
                    {uploading[docType] ? <CSpinner size="sm" /> : 'Upload'}
                  </CButton>
                </>
              )}
            </CCol>
          </CRow>
        </CListGroupItem>
      ))}
    </CListGroup>
  );
};

export default StudentDocuments;
