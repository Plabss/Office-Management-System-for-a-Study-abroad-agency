import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol } from '@coreui/react'
import { Link } from 'react-router-dom'

const WidgetsDropdown = (props) => {
  const widgetData = [
    {
      title: 'Follow Up',
      count: props.FollowUpStudents.length,
      color: 'bg-info',
      // link: '/view-students-list',
      // state: { students: props.enrolledStudents, title: 'Enrolled Students' }
    },
    {
      title: 'Enrolled Students',
      count: props.enrolledStudents.length,
      color: 'bg-primary',
      link: '/view-students-list',
      state: { students: props.enrolledStudents, title: 'Enrolled Students' },
    },
    {
      title: 'Application Processing',
      count: props.ApplicationProcessingStudents.length,
      color: 'bg-secondary',
      link: '/view-students-list',
      state: { students: props.ApplicationProcessingStudents, title: 'Application Processing Students' },
    },
    {
      title: 'Visa Processing',
      count: props.VisaProcessingStudents.length,
      color: 'bg-warning',
      link: '/view-students-list',
      state: { students: props.VisaProcessingStudents, title: 'Visa Processing Students' },
    },
    {
      title: 'Success',
      count: props.AcceptedStudents.length,
      color: 'bg-success',
      link: '/view-students-list',
      state: { students: props.AcceptedStudents, title: 'Accepted Students' },
    },
    {
      title: 'Rejected',
      count: props.RejectedStudents.length,
      color: 'bg-danger',
      link: '/view-students-list',
      state: { students: props.RejectedStudents, title: 'Rejected Students' },
    },
  ]

  const [firstRole,setFirstRole] = useState("")

  useEffect(() => {
    // Fetch employee data from localStorage
    const employee = JSON.parse(localStorage.getItem('employee'));
    if (employee) {
      setFirstRole(employee.role[0]); // Assuming role is an array and we are interested in the first role
    }
  }, []);

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      {widgetData.map((widget, index) => (
        (widget.title==='Follow Up')?(
          <>
            
            <CCol sm={12} xl={3} xxl={4} key={index}>
            <Link to={`/${firstRole}-view-visitors`} className="widget-link">
            <div className={`widget-card ${widget.color} text-white`}>
              <div className="widget-card-body">
                <h3 className="widget-title" style={{"textDecorationColor":"white"}}>{widget.title}</h3>
                <h3 className="widget-count">{widget.count}</h3>
              </div>
            </div>
          </Link>
        </CCol>
          </>
        ):(
          <CCol sm={12} xl={3} xxl={4} key={index}>
          <Link to={widget.link} state={widget.state} className="widget-link">
            <div className={`widget-card ${widget.color} text-white`}>
              <div className="widget-card-body">
                <h3 className="widget-title" style={{"textDecorationColor":"white"}}>{widget.title}</h3>
                <h3 className="widget-count">{widget.count}</h3>
              </div>
            </div>
          </Link>
        </CCol>
        )

        
      ))}
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  allStudents: PropTypes.array.isRequired,
  enrolledStudents: PropTypes.array.isRequired,
  FollowUpStudents: PropTypes.array.isRequired,
  ApplicationProcessingStudents: PropTypes.array.isRequired,
  VisaProcessingStudents: PropTypes.array.isRequired,
  SuccessStudents: PropTypes.array.isRequired,
}

export default WidgetsDropdown

// Add some custom CSS
const styles = `
.widget-card {
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease;
}
.widget-card:hover {
  transform: translateY(-5px);
}
.widget-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}
.widget-title {
  font-size: 24px; /* Larger text for the title */
  margin-bottom: 5px;
  color: white;
  text-decoration: none; /* Ensure no underline */
}
.widget-count {
  font-size: 40px; /* Smaller size for the number */
  font-weight: bold;
  color: white;
}
.widget-link {
  text-decoration: none; /* Remove underline from the entire link */
  color: inherit; /* Inherit color from parent */
}
.widget-link:hover .widget-title {
  text-decoration: none; /* Ensure title remains without underline on hover */
}
`

// Adding the styles to the document
const styleSheet = document.createElement("style")
styleSheet.type = "text/css"
styleSheet.innerText = styles
document.head.appendChild(styleSheet)