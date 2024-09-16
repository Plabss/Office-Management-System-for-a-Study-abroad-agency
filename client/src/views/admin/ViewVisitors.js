import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CPagination,
  CPaginationItem, // Import pagination components
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChevronBottom, cilPeople, cilFilter, cilSync } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Autosuggest from 'react-autosuggest'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import * as XLSX from 'xlsx' // Import xlsx library
import './ViewStudents.css' // Ensure you have the necessary CSS

const ViewVisitors = () => {
  const navigate = useNavigate()
  const [visitors, setVisitors] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [interestedCountry, setInterestedCountry] = useState('') // State for interested country filter
  const [currentPage, setCurrentPage] = useState(1) // State for current page
  const [totalPages, setTotalPages] = useState(1) // State for total pages

  useEffect(() => {
    fetchVisitors() // Fetch all visitors initially
  }, [currentPage]) // Fetch visitors whenever the page changes

  // Function to fetch visitors from backend with filters and pagination
  const fetchVisitors = async () => {
    const params = {
      name,
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
      interestedCountry,
      page: currentPage, // Pass the current page to the server
      limit: 2, // Set the number of visitors per page
    }
    try {
      const response = await axios.get('http://localhost:5000/api/v1/visitors/get-all-visitors', {
        params,
      })
      const { visitors, totalPages } = response.data
      setVisitors(visitors)
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Error fetching visitor list:', error)
    }
  }

  // Function to get suggestions for Autosuggest component
  const getSuggestions = async (value) => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/v1/visitors/get-all-visitors',
        {
          params: { name: value },
        },
      )
      return response.data?.visitors?.map((visitor) => visitor.name) || []
    } catch (error) {
      console.error('Error fetching visitor suggestions:', error)
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
    setCurrentPage(1) // Reset to the first page when applying filters
    fetchVisitors() // Fetch visitors based on the current filter criteria
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(visitors) // Convert JSON data to a worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitors') // Append worksheet to workbook
    XLSX.writeFile(workbook, 'visitors_list.xlsx') // Write the workbook to a file
  }

  const handlePageChange = (page) => {
    setCurrentPage(page) // Update the current page state
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <h4>Visitor List</h4>
            <CInputGroup className="mb-3 mt-3 d-flex justify-content-between align-items-center">
              {/* Filter Inputs */}
              <div className="d-flex align-items-center position-relative" style={{ flex: 1 }}>
                <CIcon icon={cilFilter} className="mx-2" />
                <div style={{ position: 'relative', width: '100%' }}>
                  <Autosuggest
                    suggestions={suggestions || []}
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
                  className="form-control rounded-pill"
                />
                <CInputGroupText className="rounded-pill">To</CInputGroupText>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  isClearable
                  placeholderText="End Date"
                  className="form-control rounded-pill"
                />
              </div>

              {/* Interested Country Filter as Text Input */}
              <CFormInput
                type="text"
                placeholder="Interested Country"
                className="rounded-pill mx-2"
                value={interestedCountry}
                onChange={(e) => setInterestedCountry(e.target.value)}
              />

              <CButton
                color="info"
                variant="outline"
                className="rounded-pill ml-3"
                onClick={handleFilterClick}
              >
                <CIcon icon={cilFilter} className="mr-2" />
                Apply Filters
              </CButton>

              <CButton
                color="info"
                variant="outline"
                className="rounded-pill ml-3"
                onClick={() => {
                  setName('')
                  setStartDate(null)
                  setEndDate(null)
                  setInterestedCountry('')
                  fetchVisitors() // Reset filters and fetch all visitors
                }}
              >
                <CIcon icon={cilSync} className="mr-2" />
                Reset Filters
              </CButton>
            </CInputGroup>
          </CCardHeader>
          <CCardBody>
            <CTable align="middle" hover responsive className="border">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    <CIcon icon={cilPeople} />
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    Email
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    Phone
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    Interested Countries
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    Intake
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center bg-body-tertiary">
                    Details
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {visitors?.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="text-center align-middle">
                      <CIcon icon={cilPeople} />
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.name}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.email}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.phone}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.interestedCountries}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <div className="font-weight-bold">{item.targetedIntake}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center align-middle">
                      <CIcon
                        icon={cilChevronBottom}
                        size="lg"
                        onClick={() => {
                          navigate('/view-visitor')
                          localStorage.setItem('visitorId', item._id)
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            {/* Export Button */}
            <CButton color="success" className="mt-3" onClick={exportToExcel}>
              Export to Excel
            </CButton>

            {/* Pagination Controls */}
            <CPagination align="center" className="mt-4">
              <CPaginationItem
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </CPaginationItem>
              {[...Array(totalPages).keys()].map((_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </CPaginationItem>
            </CPagination>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ViewVisitors
