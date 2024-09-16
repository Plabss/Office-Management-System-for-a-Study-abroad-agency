// VisitorSettings.js
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

const VisitorSettings = ({ visitor }) => {
  const [availableEmployees, setAvailableEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all employees to display in the dropdown
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/employees/get-all-employees-without-pagination');
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
      const response = await axios.post(`http://localhost:5000/api/v1/visitors/settings/add-employee/${visitor._id}`, {
        employeeId: selectedEmployee,
      });

      if (response.status === 200) {
        alert(`Employee added successfully!`);
        dispatch({ type: 'toggleElement', key: 'updateVisitorData' }); // Trigger state update
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/visitors/settings/remove-employee/${visitor._id}`, {
        employeeId,
      });

      if (response.status === 200) {
        alert('Employee removed successfully!');
        dispatch({ type: 'toggleElement', key: 'updateVisitorData' }); // Trigger state update
      }
    } catch (error) {
      console.error('Error removing employee:', error);
    }
  };

  return (
    <CContainer>
        {
            console.log(visitor)
        }
      <CCard>
        <CCardHeader>
          <h3>Manage Employees for {visitor.name}</h3>
        </CCardHeader>
        <CCardBody>
          {/* Employee Lists */}
          <CRow>
            <CCol md={12}>
              <h5>Counselors</h5>
              <CListGroup>
                {visitor.employees?.map((employee) => (
                  <CListGroupItem key={employee._id}>
                    {employee.name}
                    <CButton color="danger" size="sm" className="float-end" onClick={() => handleRemoveEmployee(employee._id)}>
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
            <CCol md={8}>
              <CFormSelect onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Select Employee</option>
                {availableEmployees?.map((employee) => (
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

export default VisitorSettings;
