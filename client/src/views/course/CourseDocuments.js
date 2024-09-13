import React, { useState } from 'react';
import axios from 'axios';
import { CListGroup, CListGroupItem, CButton, CRow, CCol, CFormInput, CSpinner } from '@coreui/react';
import { useDispatch } from 'react-redux';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { CIcon } from '@coreui/icons-react';
import { cilCloudDownload, cilTrash } from '@coreui/icons';

const CourseDocuments = ({ documents, onDocumentUpload, courseId, courseName }) => {
  const [uploading, setUploading] = useState({ file1: false, file2: false, file3: false });
  const dispatch = useDispatch();

  const handleFileChange = (docType, event) => {
    const updatedDocument = { ...documents, [docType]: event.target.files[0] };
    onDocumentUpload(updatedDocument);
  };

  const handleUpload = async (docType) => {
    const file = documents[docType];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentName', docType);

    try {
      setUploading({ ...uploading, [docType]: true });
      const res = await axios.post(`http://localhost:5000/api/v1/courses/upload-document/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onDocumentUpload({ ...documents, [docType]: res?.data?.data?.docType });
      dispatch({ type: 'toggleElement', key: 'courseDocUpload' });
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading({ ...uploading, [docType]: false });
    }
  };

  const handleDelete = async (docType) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/v1/courses/delete-document/${courseId}`, {
        data: { documentName: docType }, // Pass the document type to identify which document to delete
      });

      if (res.status === 200) {
        // Update document state after deletion
        onDocumentUpload({ ...documents, [docType]: null });
        dispatch({ type: 'toggleElement', key: 'courseDocUpload' });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
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

  const handleDownloadAll = async () => {
    const zip = new JSZip();

    const downloadPromises = Object.entries(documents)
      .filter(([key, value]) => value) // Only process documents that have a value
      .map(async ([docType, file]) => {
        if (typeof file === 'string') {
          // If file is a URL, fetch it as a blob
          const response = await fetch(file);
          const blob = await response.blob();
          zip.file(`${docType}.pdf`, blob); // Change extension as needed
        } else if (file instanceof File) {
          // If file is already a File object, add directly to zip
          zip.file(file.name, file);
        }
      });

    await Promise.all(downloadPromises);

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${courseName}'s-documents.zip`);
    });
  };

  return (
    <div>
      {/* Download All Button */}
      <CButton
        color="secondary"
        className="float-end"
        onClick={handleDownloadAll}
      >
        <CIcon icon={cilCloudDownload} /> Download All
      </CButton>

      <CListGroup flush>
        {['file1', 'file2', 'file3'].map((docType) => (
          <CListGroupItem key={docType}>
            <strong>{docType.toUpperCase()}:</strong>
            <CRow className="mt-2 align-items-center">
              <CCol md={8} className="d-flex align-items-center">
                {documents[docType] && typeof documents[docType] === 'string' ? (
                  <>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() => handleViewDocument(documents[docType])}
                    >
                      View Document
                    </CButton>
                    <CButton
                      color="danger"
                      size="sm"
                      className="mx-2"
                      onClick={() => handleDelete(docType)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </>
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
    </div>
  );
};

export default CourseDocuments;
