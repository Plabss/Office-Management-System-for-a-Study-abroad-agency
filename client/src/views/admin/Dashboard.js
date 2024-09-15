import React, { useEffect, useState } from 'react'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import ViewVisitors from './ViewVisitors'
import ViewStudents from './ViewStudents'
import axios from 'axios'

const Dashboard = () => {
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [visitors, setVisitors] = useState([])

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/students/get-all-students-without-pagination')
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setEnrolledStudents(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
    const fetchVisitors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/visitors/get-all-visitors-without-pagination')
        // Ensure that response.data is an array
        if (Array.isArray(response.data)) {
          setVisitors(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchVisitors();
  }, [])

  const ApplicationProcessingStudents = enrolledStudents.filter(
    (student) => student.progress === 'application processing',
  )
  const VisaProcessingStudents = enrolledStudents.filter((student) => student.progress === 'visa processing')
  const AcceptedStudents = enrolledStudents.filter((student) => student.progress === 'accepted')
  const RejectedStudents = enrolledStudents.filter((student) => student.progress === 'rejected')
  return (
    <>
      {/* <WidgetsDropdown className="mb-4" /> */}
      <WidgetsDropdown
        FollowUpStudents={visitors}
        enrolledStudents={enrolledStudents}
        ApplicationProcessingStudents={ApplicationProcessingStudents}
        VisaProcessingStudents={VisaProcessingStudents}
        AcceptedStudents={AcceptedStudents}
        RejectedStudents={RejectedStudents}
        className="mb-4"
      />
      {/* <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Visitors</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Usage</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-body-secondary text-nowrap">
                          <span>{item.user.new ? 'New' : 'Recurring'}</span> | Registered:{' '}
                          {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.country.flag} title={item.country.name} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div className="ms-3">
                            <small className="text-body-secondary">{item.usage.period}</small>
                          </div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-body-secondary text-nowrap">Last login</div>
                        <div className="fw-semibold text-nowrap">{item.activity}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> */}
      <>
        <ViewVisitors></ViewVisitors>
        <ViewStudents></ViewStudents>
      </>
    </>
  )
}

export default Dashboard
