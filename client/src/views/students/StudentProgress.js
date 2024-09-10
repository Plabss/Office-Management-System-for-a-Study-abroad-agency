/* eslint-disable react/react-in-jsx-scope */
import { CCard, CCardBody, CCardTitle, CCol, CRow } from "@coreui/react";
import './StudentProgress.css'

const StudentProgress = ({ progress }) => {
  // Define the steps of the progress bar
  const steps = [
    { key: "follow up", label: "Follow Up", description: "Initial consultation and follow-up discussions." },
    { key: "enrolled", label: "Enrolled", description: "Student has enrolled in the program." },
    { key: "application processing", label: "Application Processing", description: "Student's application is under review." },
    { key: "visa processing", label: "Visa Processing", description: "Visa application is being processed." },
  ];

  // Separate status for "Accepted" and "Rejected"
  const finalStatus = [
    { key: "accepted", label: "Accepted", description: "The student's application has been accepted." },
    { key: "rejected", label: "Rejected", description: "The student's application has been rejected." },
  ];

  return (
    <CCard>
      <CCardBody>
        <CCardTitle>Student Progress</CCardTitle>

        {/* Timeline */}
        <CRow className="mt-4">
          <CCol>
            <ul className="timeline">
              {steps.map((step) => (
                <li
                  key={step.key}
                  className={`timeline-item ${progress.progress === step.key ? "active" : ""}`}
                >
                  <h6>{step.label}</h6>
                  <p>{step.description}</p>
                </li>
              ))}
              {/* Conditionally show Accepted or Rejected status */}
              {finalStatus.map((status) => (
                progress.progress === status.key && (
                  <li
                    key={status.key}
                    className={`timeline-item ${progress.progress === status.key ? "active" : ""}`}
                  >
                    <h6>{status.label}</h6>
                    <p>{status.description}</p>
                  </li>
                )
              ))}
            </ul>
          </CCol>
        </CRow>

        {/* Additional Information */}
        <CRow className="mt-4">
          <CCol md={4}>
            <strong>Counselor:</strong> {progress.counselor?.map((c) => c.name).join(", ")}
          </CCol>
          <CCol md={4}>
            <strong>Applicant:</strong> {progress.applicant?.map((c) => c.name).join(", ")}
          </CCol>
          <CCol md={4}>
            <strong>Visa Officer:</strong> {progress.visaOfficer?.map((c) => c.name).join(", ")}
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default StudentProgress;
