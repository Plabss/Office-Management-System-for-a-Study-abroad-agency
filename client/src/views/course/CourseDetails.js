import React, { useState, useEffect } from 'react';
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
  CFormLabel,
  CFormInput,
} from '@coreui/react';
import axios from 'axios';

import CourseDocuments from './CourseDocuments';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const CourseDetails = () => {
  const courseId = localStorage.getItem('courseId');
  const studentId = localStorage.getItem('studentId');

  const dispatch = useDispatch();

  // State for course details
  const [course, setCourse] = useState({});
  const [documents, setDocuments] = useState({ file1: null, file2: null, file3: null });
  const [selectedApplicant, setSelectedApplicant] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [b2bAgentName, setB2bAgentName] = useState(''); // State for B2B agent name
  const [applicationLink, setApplicationLink] = useState(''); // State for application link
  const [isEditing, setIsEditing] = useState(false); // New state to manage edit mode
  const assignApplicant = useSelector((state) => state.assignApplicant);
  const courseDocUpload = useSelector((state) => state.courseDocUpload);
  const courseDetailsUpdated = useSelector((state) => state.courseDetailsUpdated);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees-without-pagination')
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setApplicants(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/courses/get-a-course/${courseId}`
        );
        const courseData = response.data;
        setCourse(courseData);
        setB2bAgentName(courseData.b2bAgentName || ''); // Set B2B agent name if exists
        setApplicationLink(courseData.applicationLink || ''); // Set application link if exists
        setDocuments(courseData.documents || { file1: null, file2: null, file3: null });
        if (courseData.b2bAgentName && courseData.applicationLink) {
          setIsEditing(false); // Disable editing if values already exist
        } else {
          setIsEditing(true); // Enable editing if values do not exist
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchApplicants();
    fetchCourseDetails();
  }, [assignApplicant, courseDocUpload, courseDetailsUpdated]);

  const handleAssignApplicant = async () => {
    if (selectedApplicant) {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/v1/employees/assign-applicant/${courseId}/${studentId}`,
          {
            applicantId: selectedApplicant?._id,
            applicantName: selectedApplicant?.name,
          }
        );
        if (res.status === 200) {
          toast.success(`Applicant ${selectedApplicant?.name} has been assigned to the course.`);
          dispatch({ type: 'toggleElement', key: 'assignApplicant' });
        }
      } catch (error) {
        console.error('Error assigning applicant:', error);
        toast.error('Error assigning applicant.');
      }
    } else {
      toast.error('Please select an applicant before assigning.');
    }
  };

  const handleApplicantChange = (e) => {
    const selectedId = e.target.value;
    const selected = applicants.find((applicant) => applicant._id === selectedId);
    setSelectedApplicant(selected);
  };

  const handleDocumentUpload = (updatedDocuments) => {
    setDocuments(updatedDocuments);
  };

  // Handle saving B2B agent name and application link
  const handleSaveDetails = async () => {
    if (!b2bAgentName || !applicationLink) {
      toast.error('Both fields are required.');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/v1/courses/update-course/${courseId}`, {
        b2bAgentName,
        applicationLink,
      });

      if (res.status === 200) {
        toast.success('Details saved successfully.');
        dispatch({ type: 'toggleElement', key: 'courseDetailsUpdated' });
        setIsEditing(false); // Exit edit mode after saving
      }
    } catch (error) {
      console.error('Error saving details:', error);
      toast.error('Error saving details.');
    }
  };

  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardHeader>
              <h2>Course Details</h2>
            </CCardHeader>
            <CCardBody>
              <CListGroup flush>
                <CListGroupItem>
                  <strong>Course Name:</strong> {course.name}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Level:</strong> {course.level}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>University:</strong> {course.university}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Country:</strong> {course.country}
                </CListGroupItem>
                <CListGroupItem>
                  <strong>Status:</strong> {course.status}
                </CListGroupItem>
              </CListGroup>

              {/* Applicant Selection */}
              {course.applicant?._id === null ? (
                <div>
                  <h4 className="mt-4">Assign Applicant</h4>
                  <CFormSelect
                    id="applicant"
                    name="applicant"
                    value={selectedApplicant?._id || ''}
                    onChange={handleApplicantChange}
                  >
                    <option value="">Select an Applicant</option>
                    {Array.isArray(applicants) &&
                      applicants.map((applicant) => (
                        <option key={applicant._id} value={applicant._id}>
                          {applicant.name}
                        </option>
                      ))}
                  </CFormSelect>
                  <CButton color="primary" className="mt-2" onClick={handleAssignApplicant}>
                    Assign Applicant
                  </CButton>
                </div>
              ) : (
                <>
                  <h4
                    style={{
                      color: 'blue',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    {course?.applicant?.name} is assigned as applicant
                  </h4>
                  {/* Show B2B agent name and application link if they exist */}
                  {b2bAgentName && applicationLink && !isEditing ? (
                    <div className="mt-4">
                      <p>
                        <strong>B2B Agent Name:</strong> {b2bAgentName}
                      </p>
                      <p>
                        <strong>Application Link:</strong> <a href={applicationLink} target="_blank" rel="noopener noreferrer">{applicationLink}</a>
                      </p>
                      <CButton color="info" onClick={() => setIsEditing(true)}>Edit</CButton>
                    </div>
                  ) : (
                    <>
                      {/* Input fields for B2B agent name and application link */}
                      <CFormLabel htmlFor="b2bAgentName">B2B Agent Name</CFormLabel>
                      <CFormInput
                        id="b2bAgentName"
                        value={b2bAgentName}
                        onChange={(e) => setB2bAgentName(e.target.value)}
                        placeholder="Enter B2B Agent Name"
                      />
                      <CFormLabel htmlFor="applicationLink" className="mt-3">
                        Application Link
                      </CFormLabel>
                      <CFormInput
                        id="applicationLink"
                        value={applicationLink}
                        onChange={(e) => setApplicationLink(e.target.value)}
                        placeholder="Enter Application Link"
                      />
                      <CButton
                        color="success"
                        className="mt-3"
                        onClick={handleSaveDetails}
                        disabled={!b2bAgentName || !applicationLink} // Disable button if fields are empty
                      >
                        Save
                      </CButton>
                    </>
                  )}
                  <CourseDocuments
                    documents={documents}
                    onDocumentUpload={handleDocumentUpload}
                    courseId={courseId}
                    courseName={course.name}
                  />
                </>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default CourseDetails;
