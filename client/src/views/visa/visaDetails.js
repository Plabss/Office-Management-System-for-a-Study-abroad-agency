import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CListGroup,
  CListGroupItem,
  CButton,
  CFormSelect,
  CAlert,
} from '@coreui/react'
import axios from 'axios'

import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import VisaDocuments from './VisaDocuments'

const VisaDetails = () => {
  const studentId = localStorage.getItem('studentId')
  const visaId = localStorage.getItem('visaId')

  const dispatch = useDispatch()

  // State for visa details and student progress
  const [visa, setVisa] = useState({})
  const [documents, setDocuments] = useState({ file1: null, file2: null, file3: null })
  const [selectedVisaAdmin, setSelectedVisaAdmin] = useState({})
  const [visaAdmins, setVisaAdmins] = useState([])
  const [progress, setProgress] = useState('') // State to store the current progress

  const visaDocUpload = useSelector((state) => state.visaDocUpload)
  const assignVisaAdmin = useSelector((state) => state.assignVisaAdmin)

  useEffect(() => {
    const fetchVisaAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees-without-pagination')
        if (Array.isArray(response.data)) {
          setVisaAdmins(response.data)
        } else {
          console.error('Unexpected data format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      }
    }

    const fetchVisaDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/visas/get-a-visa/${visaId}`,
        )
        const visaData = response.data
        setVisa(visaData)
        // Initialize document state based on visaData
        setDocuments(visaData.documents || { file1: null, file2: null, file3: null })
      } catch (error) {
        console.error('Error fetching visa details:', error)
      }
    }

    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/students/get-a-student/${studentId}`
        )
        const studentData = response.data
        setProgress(studentData?.progress || '') // Initialize progress state from student data
      } catch (error) {
        console.error('Error fetching student details:', error)
      }
    }

    fetchVisaAdmins()
    fetchVisaDetails()
    fetchStudentDetails()
  }, [assignVisaAdmin, visaDocUpload])

  const handleAssignVisaAdmin = async () => {
    if (selectedVisaAdmin) {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/v1/employees/assign-visa-admin/${studentId}/${visaId}`,
          {
            visaAdminId: selectedVisaAdmin?._id,
            visaAdminName: selectedVisaAdmin?.name,
          },
        )
        if (res.status === 200) {
          toast.success(`Visa admin ${selectedVisaAdmin?.name} has been assigned to the student.`)
          dispatch({ type: 'toggleElement', key: 'assignVisaAdmin' })
        }
      } catch (error) {
        console.error('Error assigning visa admin:', error)
        toast.error('Error assigning visa admin.')
      }
    } else {
      toast.error('Please select a visa admin before assigning.')
    }
  }

  const handleVisaAdminChange = (e) => {
    const selectedId = e.target.value
    const selected = visaAdmins.find((visaAdmin) => visaAdmin._id === selectedId)
    setSelectedVisaAdmin(selected)
  }

  const handleDocumentUpload = (updatedDocuments) => {
    setDocuments(updatedDocuments)
  }

  const handleDeleteDocument = async (docType) => {
    const documentUrl = documents[docType];
    if (!documentUrl) return;

    const extension = documentUrl.split('.').pop().toLowerCase();
    const resourceType = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'].includes(extension)
      ? 'image'
      : ['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(extension)
      ? 'video'
      : 'raw';

    if (window.confirm(`Are you sure you want to delete this document?`)) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/v1/visas/delete-document/${visaId}`, {
          data: { documentName: docType, resourceType }
        });

        if (res.status === 200) {
          toast.success('Document deleted successfully.');
          setDocuments((prevDocs) => ({ ...prevDocs, [docType]: null }));
        } else {
          toast.error('Error deleting document.');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Error deleting document.');
      }
    }
  };

  const handleUpdateProgress = async (status) => {
    if (window.confirm(`Are you sure you want to set the student's progress to "${status}"?`)) {
      try {
        const res = await axios.put(`http://localhost:5000/api/v1/students/update-progress/${studentId}`, {
          progress: status,
        })
        if (res.status === 200) {
          toast.success(`Student progress updated to ${status}.`)
          setProgress(status) // Update local progress state
          // setShowProgressAlert(true) // Show the progress alert
          dispatch({ type: 'toggleElement', key: 'visaDocUpload' }) // Optional: Update state if needed
        }
      } catch (error) {
        console.error('Error updating student progress:', error)
        toast.error('Error updating student progress.')
      }
    }
  }

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <h2>Visa Details</h2>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Country:</strong> {visa?.country}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>University:</strong> {visa?.course?.courseUniversity}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Course:</strong> {visa?.course?.courseName}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Applied:</strong> {visa?.status}
                </CListGroupItem>
              </CListGroup>
              {/* Visa admin Selection */}
              {visa.visaAdmin?._id === null ? (
                <div>
                  <h4 className="mt-4">Assign Visa Admin</h4>
                  <CFormSelect
                    id="visaAdmin"
                    name="visaAdmin"
                    value={selectedVisaAdmin?._id || ''}
                    onChange={handleVisaAdminChange}
                  >
                    <option value="">Select a Visa Admin</option>
                    {Array.isArray(visaAdmins) &&
                      visaAdmins.map((visaAdmin) => (
                        <option key={visaAdmin._id} value={visaAdmin._id}>
                          {visaAdmin.name}
                        </option>
                      ))}
                  </CFormSelect>
                  <CButton color="primary" className="mt-2" onClick={handleAssignVisaAdmin}>
                    Assign visa admin
                  </CButton>
                </div>
              ) : (
                <>
                  <h4 style={{ color: 'blue', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', textTransform: 'uppercase' }}>
                    {visa?.visaAdmin?.name} is assigned as visa admin
                  </h4>

                  <VisaDocuments
                    documents={documents}
                    onDocumentUpload={handleDocumentUpload}
                    onDeleteDocument={handleDeleteDocument}  // Add this prop
                    visaId={visa._id}
                  />
                </>
              )}
              {/* Buttons for Accepted and Rejected */}
              <div className="d-flex justify-content-end mt-4">
                <CButton color="success" className="mx-2" onClick={() => handleUpdateProgress('accepted')}>
                  Accepted
                </CButton>
                <CButton color="danger" onClick={() => handleUpdateProgress('rejected')}>
                  Rejected
                </CButton>
              </div>
              {/* Display Current Progress with Color */}
              {(
                <>
                  {progress === "accepted" && (
                    <CAlert color="success" className="mt-4 text-center">
                      Current Progress: <strong>Accepted</strong>
                    </CAlert>
                  )}
                  {progress === "rejected" && (
                    <CAlert color="danger" className="mt-4 text-center">
                      Current Progress: <strong>Rejected</strong>
                    </CAlert>
                  )}
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default VisaDetails
