import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import VisitorDiscussions from './VisitorDiscussions'
import VisitorSettings from './VisitorSettings'
import { useDispatch, useSelector } from 'react-redux'

const ViewVisitor = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [visitor, setVisitor] = useState({})
  const [counselors, setCounselors] = useState([]) // State for storing counselors
  const [loading, setLoading] = useState(false)
  const [discussions, setDiscussions] = useState([])
  const [conversionData, setConversionData] = useState({
    parentPhone: '',
    dob: '',
    address: '',
    counselor: '',
  })
  const employee = JSON.parse(localStorage.getItem('employee'))
  const assignedBy = {
    name: employee.name,
    _id: employee._id,
  }
  const [activeTab, setActiveTab] = useState('basic-info') // Manage active tab state

  const updateVisitorData = useSelector((state) => state.updateVisitorData)
  const addDiscussion = useSelector((state) => state.addDiscussion)

  // Get the visitor ID from local storage
  const visitorId = localStorage.getItem('visitorId')
  console.log(visitorId)

  useEffect(() => {
    // Fetch the visitor details by ID
    const fetchVisitorDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/visitors/get-a-visitor/${visitorId}`,
        )
        console.log(response.data[0])
        setVisitor(response.data[0])
        setDiscussions(response.data[0].discussions)
      } catch (error) {
        console.error('Error fetching visitor details:', error)
      }
    }
    fetchVisitorDetails()
  }, [visitorId, updateVisitorData, addDiscussion])

  useEffect(() => {
    // Fetch all available counselors
    const fetchCounselors = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/employees/get-all-employees-without-pagination',
        )
        if (Array.isArray(response.data)) {
          setCounselors(response.data)
        } else {
          console.error('Unexpected data format:', response.data)
        }
      } catch (error) {
        console.error('Error fetching counselors:', error)
      }
    }
    fetchCounselors()
  }, [visitorId])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setConversionData({
      ...conversionData,
      [name]: value,
    })
  }

  const handleConversion = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/visitors/convert-to-student/${visitorId}`,
        conversionData,
      )
      console.log('Conversion successful:', response.data)
      toast.success('Visitor successfully converted to student.')
      const employee = localStorage.getItem('employee')
      console.log('Employee:', employee)
      const firstRole = JSON.parse(employee).role[0] // Use the first role for redirection
      navigate(`/${firstRole}-view-students`)
    } catch (error) {
      console.error('Error converting visitor to student:', error)
      toast.error('Error converting visitor to student.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddDiscussion = async (newDiscussion) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/visitors/add-discussion/${visitorId}`,
        {
          ...newDiscussion,
          assignedBy: assignedBy, // Assuming the discussion to be associated by the employee
        },
      )
      if (response.status === 201) {
        console.log('status: ', response.status)
        dispatch({ type: 'toggleElement', key: 'addDiscussion' })
        const addedDiscussion = response.data
        setDiscussions((prevDiscussions) => [...prevDiscussions, addedDiscussion.savedDiscussion])
      } else {
        console.error('Failed to add discussion:', response.data)
        setError('Failed to add discussion.')
      }
    } catch (error) {
      console.error('Failed to add discussion:', error)
      setError('Failed to add discussion.')
    }
  }
  const handleDeleteDiscussion = async (discussionId) => {
    try {
      console.log('ddddd', discussionId)
      const response = await axios.delete(
        `http://localhost:5000/api/v1/visitors/delete-discussion/${visitorId}/${discussionId}`,
      )
      if (response.status === 200) dispatch({ type: 'toggleElement', key: 'addDiscussion' })
    } catch (error) {
      console.error('Failed to delete discussion:', error)
      setError('Failed to delete discussion.')
    }
  }

  return (
    <CContainer className="mt-4">
      {/* Tab Navigation */}
      <CNav variant="tabs" role="tablist">
        <CNavItem>
          <CNavLink active={activeTab === 'basic-info'} onClick={() => setActiveTab('basic-info')}>
            Basic Information
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 'discussion'} onClick={() => setActiveTab('discussion')}>
            Discussion
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            Settings
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === 'convert-to-student'}
            onClick={() => setActiveTab('convert-to-student')}
          >
            Convert to Student
          </CNavLink>
        </CNavItem>
      </CNav>

      {console.log(visitor)}
      <CTabContent className="mt-4">
        {/* Basic Information Tab */}
        <CTabPane visible={activeTab === 'basic-info'}>
          <CContainer>
            <CRow className="justify-content-center">
              <CCol xs={12}>
                <CCard>
                  <CCardHeader>
                    <h2>Visitor Details</h2>
                  </CCardHeader>
                  <CCardBody>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <strong>Name:</strong> {visitor.name}
                      </CCol>
                      <CCol md={6}>
                        <strong>Email:</strong> {visitor.email}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <strong>Phone:</strong> {visitor.phone}
                      </CCol>
                      <CCol md={6}>
                        <strong>Interested Countries:</strong> {visitor.interestedCountries}
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <strong>Targeted Intake:</strong> {visitor.targetedIntake}
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CContainer>
        </CTabPane>

        {/* Discussion Tab */}
        <CTabPane visible={activeTab === 'discussion'}>
          <VisitorDiscussions
            discussions={discussions}
            onAddDiscussion={handleAddDiscussion}
            onDeleteDiscussion={handleDeleteDiscussion}
          />
        </CTabPane>

        {/* Settings Tab */}
        <CTabPane visible={activeTab === 'settings'}>
          <VisitorSettings visitor={visitor} />
        </CTabPane>

        {/* Convert to Student Tab */}
        <CTabPane visible={activeTab === 'convert-to-student'}>
          <CRow className="justify-content-center mt-4">
            <CCol xs={12}>
              <CCard>
                <CCardHeader>
                  <h2>Convert to Student</h2>
                </CCardHeader>
                <CCardBody>
                  <CForm onSubmit={handleConversion}>
                    <CRow className="mb-3">
                      <CCol md={6}>
                        <CFormLabel htmlFor="parentPhone">Parent Phone</CFormLabel>
                        <CFormInput
                          type="text"
                          id="parentPhone"
                          name="parentPhone"
                          value={conversionData.parentPhone}
                          onChange={handleInputChange}
                          required
                        />
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel htmlFor="dob">Date of Birth</CFormLabel>
                        <CFormInput
                          type="date"
                          id="dob"
                          name="dob"
                          value={conversionData.dob}
                          onChange={handleInputChange}
                          required
                        />
                      </CCol>
                    </CRow>
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel htmlFor="address">Address</CFormLabel>
                        <CFormInput
                          type="text"
                          id="address"
                          name="address"
                          value={conversionData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </CCol>
                    </CRow>

                    {/* Counselor Selection */}
                    <CRow className="mb-3">
                      <CCol md={12}>
                        <CFormLabel htmlFor="counselor">Assign Counselor</CFormLabel>
                        <CFormSelect
                          id="counselor"
                          name="counselor"
                          value={conversionData.counselor}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            Select a Counselor
                          </option>
                          {Array.isArray(counselors) &&
                            counselors.map((counselor) => (
                              <option key={counselor._id} value={counselor._id}>
                                {counselor.name}
                              </option>
                            ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CButton type="submit" color="primary" disabled={loading}>
                      {loading ? <CSpinner size="sm" /> : 'Convert to Student'}
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CTabPane>
      </CTabContent>
    </CContainer>
  )
}

export default ViewVisitor
