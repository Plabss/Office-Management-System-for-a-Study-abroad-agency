import React, { useState } from 'react';
import {
  CButton,
  CForm,
  CFormTextarea,
  CSpinner,
  CCard,
  CCardBody,
  CCardHeader,
  CListGroup,
  CListGroupItem,
  CContainer,
  CRow,
  CCol,
  CTooltip,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTrash } from '@coreui/icons';
import axios from 'axios';

const StudentDiscussions = ({ discussions, onAddDiscussion, onDeleteDiscussion }) => {
  const [newDiscussion, setNewDiscussion] = useState({
    message: '',
  });

  const [addingDiscussion, setAddingDiscussion] = useState(false);

  // Get employee details from local storage
  const employee = JSON.parse(localStorage.getItem('employee')) || {};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDiscussion({
      ...newDiscussion,
      [name]: value,
    });
  };

  const handleAddDiscussion = async (e) => {
    e.preventDefault();
    setAddingDiscussion(true);
    try {
      await onAddDiscussion(newDiscussion);
      setNewDiscussion({
        message: '',
      });
    } catch (error) {
      console.error('Failed to add discussion:', error);
    } finally {
      setAddingDiscussion(false);
    }
  };

  const handleDeleteDiscussion = async (discussionId) => {
    try {
      await onDeleteDiscussion(discussionId);
    } catch (error) {
      console.error('Failed to delete discussion:', error);
    }
  };

  return (
    <CContainer>
      <CRow className="mb-4">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h1>Discussions</h1>
            </CCardHeader>
            <CCardBody>
              {discussions.length > 0 ? (
                <CListGroup>
                  {discussions.map((discussion, index) => (
                    <CListGroupItem
                      key={index}
                      className={`d-flex justify-content-between align-items-center ${
                        discussion?.employee_name === employee?.name ? 'bg-light text-dark' : ''
                      }`}
                    >
                      <div>
                        <strong>{discussion?.employee_name}:</strong> {discussion?.message}
                      </div>
                      {discussion?.employee_name === employee.name && (
                        <CTooltip content="Delete">
                          <CButton
                            color="danger"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDiscussion(discussion._id)}
                          >
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTooltip>
                      )}
                    </CListGroupItem>
                  ))}
                </CListGroup>
              ) : (
                <p>No discussions available.</p>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h2>Add Discussion</h2>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleAddDiscussion}>
                <CFormTextarea
                  name="message"
                  placeholder="Enter your message here..."
                  value={newDiscussion.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="mb-3"
                />
                <CButton type="submit" color="primary" disabled={addingDiscussion}>
                  {addingDiscussion ? <CSpinner size="sm" /> : 'Add Discussion'}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default StudentDiscussions;
