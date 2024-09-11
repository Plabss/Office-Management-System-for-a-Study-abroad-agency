import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const StudentSettings = ({ student }) => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [roleType, setRoleType] = useState('counselor'); // Default role type
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all employees to display in the dropdown
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees');
        setAvailableEmployees(response.data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleAddEmployee = async () => {
    if (!selectedEmployee) {
      alert('Please select an employee to add.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/v1/students/settings/add-employee/${student._id}`, {
        employeeId: selectedEmployee,
        role: roleType, // Role to assign (counselor, applicant, visaAdmin)
      });

      if (response.status === 200) {
        alert(`Employee added as ${roleType} successfully!`);
        dispatch({ type: 'toggleElement', key: 'updateStudentData' }); // Trigger state update
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleRemoveEmployee = async (employeeId, role) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/students/settings/remove-employee/${student._id}`, {
        employeeId,
        role, // Role to remove (counselor, applicant, visaAdmin)
      });

      if (response.status === 200) {
        alert('Employee removed successfully!');
        dispatch({ type: 'toggleElement', key: 'updateStudentData' }); // Trigger state update
      }
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  return (
    <CContainer>
      <CCard>
        <CCardHeader>
          <h3>Manage Employees for {student.fullName}</h3>
        </CCardHeader>
        <CCardBody>
          {/* Employee Lists */}
          <CRow>
            <CCol md={4}>
              <h5>Counselors</h5>
              <CListGroup>
                {student.employees.asCounselor.map((employee) => (
                  <CListGroupItem key={employee._id}>
                    {employee.name}
                    <CButton color="danger" size="sm" className="float-end" onClick={() => handleRemoveEmployee(employee._id, 'counselor')}>
                      Remove
                    </CButton>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCol>
            <CCol md={4}>
              <h5>Applicants</h5>
              <CListGroup>
                {student.employees.asApplicant.map((employee) => (
                  <CListGroupItem key={employee._id}>
                    {employee.name}
                    <CButton color="danger" size="sm" className="float-end" onClick={() => handleRemoveEmployee(employee._id, 'applicant')}>
                      Remove
                    </CButton>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCol>
            <CCol md={4}>
              <h5>Visa Admins</h5>
              <CListGroup>
                {student.employees.asVisaAdmin.map((employee) => (
                  <CListGroupItem key={employee._id}>
                    {employee.name}
                    <CButton color="danger" size="sm" className="float-end" onClick={() => handleRemoveEmployee(employee._id, 'visaAdmin')}>
                      Remove
                    </CButton>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCol>
          </CRow>

          {/* Add Employee Section */}
          <h5 className="mt-4">Add Employee</h5>
          <CRow className="align-items-end">
            <CCol md={4}>
              <CFormSelect onChange={(e) => setRoleType(e.target.value)}>
                <option value="counselor">Counselor</option>
                <option value="applicant">Applicant</option>
                <option value="visaAdmin">Visa Admin</option>
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CFormSelect onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Select Employee</option>
                {availableEmployees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
            <CCol md={4}>
              <CButton color="primary" onClick={handleAddEmployee}>
                Add Employee
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default StudentSettings;
