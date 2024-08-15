/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// StudentInfo.js
import React from 'react';
import { CListGroup, CListGroupItem } from '@coreui/react';

const StudentInfo = ({ student }) => (
  <CListGroup flush>
    <CListGroupItem><strong>Student ID:</strong> {student.studentId}</CListGroupItem>
    <CListGroupItem><strong>Full Name:</strong> {student.fullName}</CListGroupItem>
    <CListGroupItem><strong>Email:</strong> {student.email}</CListGroupItem>
    <CListGroupItem><strong>Phone Number:</strong> {student.phoneNumber}</CListGroupItem>
    <CListGroupItem><strong>Parent Phone:</strong> {student.parentPhone}</CListGroupItem>
    <CListGroupItem><strong>Date of Birth:</strong> {student.dob}</CListGroupItem>
    <CListGroupItem><strong>Address:</strong> {student.address}</CListGroupItem>
  </CListGroup>
);

export default StudentInfo;
