/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
// StudentCourses.js
import React from 'react';
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';
import { Link } from 'react-router-dom';

const StudentCourses = ({ courses }) => (
  <CTable hover>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell>Course Name</CTableHeaderCell>
        <CTableHeaderCell>Applied</CTableHeaderCell>
        <CTableHeaderCell>Details</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      {courses.map((course, index) => (
        <CTableRow key={index}>
          <CTableDataCell>{course.name}</CTableDataCell>
          <CTableDataCell>{course.applied}</CTableDataCell>
          <CTableDataCell><Link to={"/enrolled-course"}>More</Link></CTableDataCell>
        </CTableRow>
      ))}
    </CTableBody>
  </CTable>
);

export default StudentCourses;
