import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ApplicantPrivate = ({ children }) => {
    const employee = JSON.parse(localStorage.getItem("employee")); // Get user info from localStorage
    const location = useLocation();

    // Check if the user is an applicant
    if (employee && employee.role.includes('applicant')) {
        return children; // Render the children components (the protected routes)
    }

    // Redirect to login if not an applicant
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ApplicantPrivate;
