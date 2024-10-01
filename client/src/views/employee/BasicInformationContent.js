import { CButton, CFormLabel, CListGroup, CListGroupItem, CFormSelect } from '@coreui/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const BasicInformationContent = ({ employee }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState(employee.role || []); // Local state for roles to re-render the component
  const [disabled, setDisabled] = useState(employee.disabled); // State for employee's disabled status
  const availableRoles = ['receptionist', 'counselor', 'applicant', 'visa-admin'];
  const dispatch = useDispatch();

  const handleAddRole = async () => {
    if (selectedRole && !roles.includes(selectedRole)) {
      try {
        const response = await axios.put(`http://localhost:5000/api/v1/employees/update-role/${employee._id}`, {
          role: selectedRole,
          action: 'add',
        });

        if (response.status === 200) {
          // Update local state to reflect the new role
          setRoles((prevRoles) => [...prevRoles, selectedRole]);
          setSelectedRole('');
          dispatch({ type: 'toggleElement', key: 'updateRole' });
        } else {
          console.error('Failed to add role:', response.data);
        }
      } catch (error) {
        console.error('Error while adding role:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleRemoveRole = async (roleToRemove) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/employees/update-role/${employee._id}`, {
        role: roleToRemove,
        action: 'remove',
      });

      if (response.status === 200) {
        // Update local state to remove the role
        setRoles((prevRoles) => prevRoles.filter((role) => role !== roleToRemove));
        toast.success(response.data);
        dispatch({ type: 'toggleElement', key: 'updateRole' });
      } else {
        console.error('Failed to remove role:', response.data);
        toast.error(response.data);
      }
    } catch (error) {
      console.error('Error while removing role:', error.response ? error.response.data : error.message);
    }
  };

  // Handle disabling/enabling employee
  const handleDisableEmployee = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/employees/disable-employee/${employee._id}`, {
        disabled: !disabled, // Toggle disabled status
      });

      if (response.status === 200) {
        setDisabled(!disabled); // Update local state
        toast.success(`Employee has been ${!disabled ? 'disabled' : 'enabled'}`);
      } else {
        console.error('Failed to disable/enable employee:', response.data);
        toast.error('Failed to update employee status.');
      }
    } catch (error) {
      console.error('Error while disabling/enabling employee:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between">
        <h5>Basic Information</h5>
        <CButton color={disabled ? 'success' : 'danger'} onClick={handleDisableEmployee}>
          {disabled ? 'Enable Employee' : 'Disable Employee'}
        </CButton>
      </div>
      <p>Name: {employee.name}</p>
      <p>Email: {employee.email}</p>
      <p>Phone: {employee.phone}</p>
      <CButton color="info" onClick={() => window.open(employee.cv, '_blank')}>
        View CV
      </CButton>
      <br />
      <CButton className="mt-4" color="info" onClick={() => window.open(employee.nid, '_blank')}>
        View NID
      </CButton>

      <div className="mt-2">
        <CFormLabel>Roles</CFormLabel>
        <CListGroup>
          {roles.map((r, index) => (
            <CListGroupItem key={index}>
              {r}
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleRemoveRole(r)}
                className="float-end"
              >
                Remove
              </CButton>
            </CListGroupItem>
          ))}
        </CListGroup>
      </div>

      {/* Add Role Dropdown */}
      <div className="mt-3">
        <CFormSelect
          aria-label="Select Role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select a role</option>
          {availableRoles.map((role, index) => (
            <option key={index} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </CFormSelect>
        <CButton className="mt-2" color="success" onClick={handleAddRole}>
          Add Role
        </CButton>
      </div>
    </div>
  );
};

export default BasicInformationContent;
