import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CRow,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import axios from 'axios'
import TableSection from '../students/TableSection'

const ViewStudents = () => {
  const [activeTab, setActiveTab] = useState('all-students')
  const [students, setStudents] = useState([])
  const [employeeId, setEmployeeId] = useState(null)
  const [employeeRole, setEmployeeRole] = useState('')

  useEffect(() => {
    // Fetch employee data from localStorage
    const employee = JSON.parse(localStorage.getItem('employee'))
    if (employee) {
      setEmployeeId(employee._id)
      setEmployeeRole(employee.role[0]) // Assuming role is an array and we are interested in the first role
    }
  }, [])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        let response
        if (employeeRole === 'receptionist' || employeeRole === 'super-admin') {
          console.log('Fetching all students') // Debugging log
          response = await axios.get(`http://localhost:5000/api/v1/students/get-all-students`)
        } else if (employeeId) {
          console.log('Fetching students with employeeID:', employeeId) // Debugging log
          response = await axios.get(
            `http://localhost:5000/api/v1/students/get-all-students/${employeeId}`,
          )
        } else {
          console.log('No valid employee ID or role to fetch students') // Debugging log
          return
        }
        setStudents(response.data)
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    fetchStudents()
  }, [employeeId, employeeRole]) // Run this effect whenever employeeId or employeeRole changes

  // Helper function to get unique students based on a given filter
  const getUniqueStudents = (filteredStudents) => {
    const studentMap = new Map()
    filteredStudents.forEach((student) => {
      if (!studentMap.has(student._id)) {
        studentMap.set(student._id, student)
      }
    })
    return Array.from(studentMap.values())
  }

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <h2>Students List</h2>
            </CCardHeader>
            <CCardBody>
              <CTabs activeItemKey={activeTab}>
                <CNav variant="tabs">
                  <CNavItem>
                    <CNavLink
                      active={activeTab === 'all-students'}
                      onClick={() => setActiveTab('all-students')}
                    >
                      All Students
                    </CNavLink>
                  </CNavItem>
                  {employeeRole !== 'receptionist' && employeeRole !== 'super-admin' ? (
                    <>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'counseling-students'}
                          onClick={() => setActiveTab('counseling-students')}
                        >
                          Counseling Students
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'university-application'}
                          onClick={() => setActiveTab('university-application')}
                        >
                          University Application Students
                        </CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink
                          active={activeTab === 'visa-application'}
                          onClick={() => setActiveTab('visa-application')}
                        >
                          Visa Application Students
                        </CNavLink>
                      </CNavItem>
                    </>
                  ) : null}
                </CNav>
                <CTabContent>
                  <CTabPane visible={activeTab === 'all-students'}>
                    <TableSection data={getUniqueStudents(students)} />
                  </CTabPane>
                  {employeeRole !== 'receptionist' && employeeRole !== 'super-admin' ? (
                    <>
                      <CTabPane visible={activeTab === 'counseling-students'}>
                        <TableSection
                          data={getUniqueStudents(
                            students.filter((student) =>
                              student.employees?.asCounselor?.includes(employeeId),
                            ),
                          )}
                        />
                      </CTabPane>
                      <CTabPane visible={activeTab === 'university-application'}>
                        <TableSection
                          data={getUniqueStudents(
                            students.filter((student) =>
                              student.employees?.asApplicant?.includes(employeeId),
                            ),
                          )}
                        />
                      </CTabPane>
                      <CTabPane visible={activeTab === 'visa-application'}>
                        <TableSection
                          data={getUniqueStudents(
                            students.filter((student) =>
                              student.employees?.asVisaAdmin?.includes(employeeId),
                            ),
                          )}
                        />
                      </CTabPane>
                    </>
                  ) : null}
                </CTabContent>
              </CTabs>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ViewStudents
