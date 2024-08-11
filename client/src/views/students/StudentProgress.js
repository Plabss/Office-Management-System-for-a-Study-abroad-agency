// StudentProgress.js
import React from 'react';
import './StudentProgress.css'
import { CListGroup, CListGroupItem, CRow, CCol, CCard, CCardBody, CCardTitle } from '@coreui/react';

const StudentProgress = ({ progress, counselor, applicant, visaOfficer }) => (
  <CCard>
    <CCardBody>
      <CCardTitle>Student Progress</CCardTitle>

      {/* Timeline */}
      <CRow className="mt-4">
        <CCol>
          <ul className="timeline">
            <li className="timeline-item">
              <h6>Follow Up</h6>
              <p>Initial consultation and follow-up discussions.</p>
            </li>
            <li className="timeline-item">
              <h6>Enrolled</h6>
              <p>Student has enrolled in the program.</p>
            </li>
            <li className="timeline-item">
              <h6>Application Processing</h6>
              <p>Student's application is under review.</p>
            </li>
            <li className="timeline-item">
              <h6>Visa Processing</h6>
              <p>Visa application is being processed.</p>
            </li>
            <li className="timeline-item">
              <h6>Accepted/Rejected</h6>
              <p>Final decision on the student's application.</p>
            </li>
          </ul>
        </CCol>
      </CRow>

      {/* Additional Information */}
      <CRow className="mt-4">
        <CCol md={4}><strong>Counselor:</strong> {counselor}</CCol>
        <CCol md={4}><strong>Applicant:</strong> {applicant}</CCol>
        <CCol md={4}><strong>Visa Officer:</strong> {visaOfficer}</CCol>
      </CRow>
    </CCardBody>
  </CCard>
);

export default StudentProgress;
