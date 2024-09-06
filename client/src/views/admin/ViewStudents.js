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
  CButton,
  CInputGroupText,
  CInputGroup,
} from '@coreui/react'
import axios from 'axios'
import TableSection from '../students/TableSection'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPeople, cilSync, cilUser } from '@coreui/icons'
import Autosuggest from 'react-autosuggest'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector } from 'react-redux'
import './ViewStudents.css'

const ViewStudents = () => {
  const [activeTab, setActiveTab] = useState('all-students')
  const [students, setStudents] = useState([])
  const [employeeId, setEmployeeId] = useState(null)
  const [employeeRole, setEmployeeRole] = useState('')
  const [name, setName] = useState('')

  const [isDarkMode, setIsDarkMode] = useState(false)
  const storedTheme = useSelector((state) => state.theme)
  const [suggestions, setSuggestions] = useState([])

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  useEffect(() => {
    setIsDarkMode(storedTheme === 'dark')

    // Fetch employee data from localStorage
    const employee = JSON.parse(localStorage.getItem('employee'))
    if (employee) {
      setEmployeeId(employee._id)
      setEmployeeRole(employee.role[0]) // Assuming role is an array and we are interested in the first role
    }
  }, [storedTheme])

  const fetchStudents = async () => {
    const params = {
      name,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    }
    try {
      let response
      if (employeeRole === 'receptionist' || employeeRole === 'super-admin') {
        console.log('Fetching all students') // Debugging log
        response = await axios.get(`http://localhost:5000/api/v1/students/get-all-students`, {
          params,
        })
      } else if (employeeId) {
        console.log('Fetching students with employeeID:', employeeId) // Debugging log
        response = await axios.get(
          `http://localhost:5000/api/v1/students/get-all-students/${employeeId}`,
          { params },
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

  useEffect(() => {
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

  const getSuggestions = async (value) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/students/get-all-students', {
        params: { name: value },
      })
      return response.data.map((student) => student.fullName)
    } catch (error) {
      console.error('Error fetching student suggestions:', error)
      return []
    }
  }

  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await getSuggestions(value)
    setSuggestions(suggestions)
  }

  const onSuggestionsClearRequested = () => {
    setSuggestions([])
  }

  const onSuggestionSelected = (event, { suggestionValue }) => {
    setName(suggestionValue)
  }

  const onChange = (event, { newValue }) => {
    setName(newValue)
  }

  const inputProps = {
    placeholder: 'Search by name',
    value: name,
    onChange,
    className: 'form-control rounded-pill',
  }

  const handleFilterClick = () => {
    fetchStudents() // Fetch students based on the current filter criteria
  }

  return (
    <CContainer fluid className="mt-4">
      <CRow>
        <CCol>
          <CCard className="shadow-sm">
            <CCardHeader
              className={`${
                isDarkMode ? 'bg-gradient-dark text-white' : 'bg-gradient-primary text-black'
              } rounded-top`}
            >
              <h2 className="h5 mb-0 d-flex align-items-center">
                <CIcon icon={cilPeople} className="mx-2" />
                Students List
              </h2>
              <CInputGroup className="mb-3 mt-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center position-relative" style={{ flex: 1 }}>
                  <CIcon icon={cilFilter} className="mx-2" />
                  <div style={{ position: 'relative', width: '100%' }}>
                    {' '}
                    {/* Wrapper to control Autosuggest positioning */}
                    <Autosuggest
                      suggestions={suggestions}
                      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                      onSuggestionsClearRequested={onSuggestionsClearRequested}
                      onSuggestionSelected={onSuggestionSelected}
                      getSuggestionValue={(suggestion) => suggestion}
                      renderSuggestion={(suggestion) => <div className="p-1">{suggestion}</div>}
                      inputProps={inputProps}
                      theme={{
                        input: 'form-control rounded-pill',
                        suggestionsContainer: 'suggestions-container shadow rounded mt-2',
                        suggestion: 'p-2 suggestion-item',
                        suggestionHighlighted: 'suggestion-item--highlighted',
                      }}
                    />
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <CInputGroupText className="rounded-pill">From</CInputGroupText>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    isClearable
                    placeholderText="Start Date"
                    className={`form-control rounded-pill ${isDarkMode ? 'bg-dark text-light' : ''}`}
                  />
                  <CInputGroupText className="rounded-pill">To</CInputGroupText>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    isClearable
                    placeholderText="End Date"
                    className={`form-control rounded-pill ${isDarkMode ? 'bg-dark text-light' : ''}`}
                  />
                </div>

                <CButton
                  color="info"
                  variant={isDarkMode ? 'outline-light' : 'outline'}
                  className="rounded-pill ml-3"
                  onClick={handleFilterClick}
                >
                  <CIcon icon={cilFilter} className="mr-2" />
                  Apply Filters
                </CButton>

                <CButton
                  color="info"
                  variant={isDarkMode ? 'outline-light' : 'outline'}
                  className="rounded-pill ml-3"
                  onClick={() => {
                    setName('')
                    setStartDate(null)
                    setEndDate(null)
                    fetchStudents() // Reset filters and fetch all students
                  }}
                >
                  <CIcon icon={cilSync} className="mr-2" />
                  Reset Filters
                </CButton>
              </CInputGroup>
            </CCardHeader>
            <CCardBody className={isDarkMode ? 'bg-dark text-light' : ''}>
              <CNav
                variant="tabs"
                className={`rounded ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}
              >
                <CNavItem>
                  <CNavLink
                    active={activeTab === 'all-students'}
                    onClick={() => setActiveTab('all-students')}
                    className={isDarkMode ? 'text-light' : ''}
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
                        className={isDarkMode ? 'text-light' : ''}
                      >
                        Counseling Students
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === 'university-application'}
                        onClick={() => setActiveTab('university-application')}
                        className={isDarkMode ? 'text-light' : ''}
                      >
                        University Application
                      </CNavLink>
                    </CNavItem>
                    <CNavItem>
                      <CNavLink
                        active={activeTab === 'visa-application'}
                        onClick={() => setActiveTab('visa-application')}
                        className={isDarkMode ? 'text-light' : ''}
                      >
                        Visa Application
                      </CNavLink>
                    </CNavItem>
                  </>
                ) : null}
              </CNav>
              <CTabContent className="mt-4">
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default ViewStudents
