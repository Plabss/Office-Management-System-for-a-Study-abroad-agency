import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import {
  CListGroup,
  CListGroupItem,
  CButton,
  CRow,
  CCol,
  CFormInput,
  CSpinner,
  CCard,
  CCardHeader,
  CCardBody,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import JSZip from 'jszip'
import { saveAs } from 'file-saver' // file-saver is used to save the zip file on the client side
import CIcon from '@coreui/icons-react' // Ensure this is installed or replace with another icon library
import { cilCloudDownload, cilTrash } from '@coreui/icons' // Import icons for download and delete

const StudentDocumentPrivate = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [documents, setDocuments] = useState({ cv: null, nid: null })
  const [uploading, setUploading] = useState({ cv: false, nid: false })
  const [loading, setLoading] = useState(true)
  const upload = useSelector((state) => state.upload)

  useEffect(() => {
    const StudentToken = localStorage.getItem('StudentToken')
    const loggedInStudentId = localStorage.getItem('loggedInStudentId')

    // Check if the student is authenticated and the route matches their ID
    if (!StudentToken || loggedInStudentId !== studentId) {
      navigate('/student-login') // Redirect to login if unauthorized
      return
    }

    // Fetch existing documents for the student
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/students/get-documents-private/${studentId}`,
          {
            headers: { Authorization: `Bearer ${StudentToken}` },
          },
        )
        setDocuments(res.data.documents)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching documents:', error)
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [navigate, studentId, upload])

  const handleFileChange = (docType, event) => {
    const updatedDocument = { ...documents, [docType]: event.target.files[0] }
    setDocuments(updatedDocument)
  }

  const handleUpload = async (docType) => {
    const file = documents[docType]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file) // Ensure the key is 'file' as per backend expectation
    formData.append('documentName', docType)

    try {
      setUploading({ ...uploading, [docType]: true })
      const token = localStorage.getItem('StudentToken')
      const res = await axios.post(
        `http://localhost:5000/api/v1/students/upload-document-private/${studentId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      // Update document status to 'Uploaded'
      setDocuments({ ...documents, [docType]: res?.data?.data?.docType })
      dispatch({ type: 'toggleElement', key: 'upload' })
    } catch (error) {
      console.error('Error uploading file:', error)
    } finally {
      setUploading({ ...uploading, [docType]: false })
    }
  }

  const handleDeleteDocument = async (docType) => {
    try {
      const token = localStorage.getItem('StudentToken')
      await axios.delete(
        `http://localhost:5000/api/v1/students/delete-document-private/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { documentName: docType },
        },
      )

      // Remove document from state after successful deletion
      setDocuments({ ...documents, [docType]: null })
      dispatch({ type: 'toggleElement', key: 'upload' })
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const handleViewDocument = (file) => {
    if (typeof file === 'string') {
      window.open(file, '_blank')
    } else if (file) {
      const fileURL = URL.createObjectURL(file)
      window.open(fileURL, '_blank')
    }
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()

    const downloadPromises = Object.entries(documents)
      .filter(([key, value]) => value) // Only process documents that have a value
      .map(async ([docType, file]) => {
        if (typeof file === 'string') {
          // If file is a URL, fetch it as a blob
          const response = await fetch(file)
          const blob = await response.blob()
          zip.file(`${docType}.pdf`, blob)
        } else if (file instanceof File) {
          // If file is already a File object, add directly to zip
          zip.file(file.name, file)
        }
      })

    await Promise.all(downloadPromises)

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'student-documents.zip')
    })
  }

  if (loading) {
    return <CSpinner />
  }

  return (
    <CCard style={{"padding":"3rem"}}>
      <CCardHeader>
        <h2>Upload Your Documents</h2>
        <CButton color="secondary" className="float-end" onClick={handleDownloadAll}>
          <CIcon icon={cilCloudDownload} /> Download All
        </CButton>
      </CCardHeader>

      <CCardBody>
        <CListGroup flush>
          {['cv', 'nid'].map((docType) => (
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
                  {documents[docType] && (
                    <CButton
                      color="danger"
                      size="sm"
                      className="mx-2"
                      onClick={() => handleDeleteDocument(docType)}
                    >
                      <CIcon icon={cilTrash} /> Delete
                    </CButton>
                  )}
                </CCol>
              </CRow>
            </CListGroupItem>
          ))}
        </CListGroup>
      </CCardBody>
    </CCard>
  )
}

export default StudentDocumentPrivate
