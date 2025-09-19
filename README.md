# Office Management System for a Study Abroad Agency

A comprehensive web-based office management system built with modern technologies, designed to streamline various administrative tasks and improve workflow efficiency in an office environment. This system is particularly tailored for organizations dealing with student applications, visa processing, and visitor management.

## Features

### 🔐 Multi-Role Authentication System
- Secure login system with role-based access control
- Multiple user roles:
  - Super Admin
  - Counselor
  - Visa Admin
  - Receptionist
  - Applicant

### 👥 Employee Management
- Add new employees with complete profile information
- Upload and manage employee documents (CV, NID, Profile Image)
- Role assignment and management
- Enable/disable employee accounts
- View all employees with pagination support

### 🎓 Student Management
- Comprehensive student registration system
- Document management for student files
- Progress tracking system
- Course enrollment management
- Visa application processing
- Student profile updates
- Discussion thread for each student
- Private document upload for students

### 👋 Visitor Management
- Visitor registration and tracking
- Document upload for visitors (NID/Birth Certificate)
- Convert visitors to students
- Assign employees to visitors
- Discussion threads for visitor follow-ups
- Comprehensive visitor tracking system

### 📚 Course Management
- Add and manage courses
- Document management for course materials
- Course details updates
- Student enrollment tracking
- Course progress monitoring

### 🛂 Visa Processing
- Visa application management
- Document upload and management
- Visa status tracking
- Assign visa administrators
- Track visa processing progress

### 📨 Notification System
- Real-time notifications for users
- Mark notifications as read
- Notification history tracking
- Role-specific notifications

### 📊 Dashboard & Analytics
- Role-specific dashboards
- Visual representation of data
- Student progress tracking
- Visitor statistics
- Course enrollment analytics

### 🔄 Workflow Management
- Structured workflow for student applications
- Visa processing workflow
- Document verification process
- Task assignment system

## Technical Stack

### Frontend
- React.js
- CoreUI for React
- Redux for state management
- React Router for navigation
- Axios for API calls
- TailwindCSS for styling

### Backend
- Node.js
- Express.js
- MongoDB for database
- Cloudinary for file storage
- JWT for authentication
- Bcrypt for password hashing
- Multer for file upload handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- NPM or Yarn package manager

### Installation

1. Clone the repository
```bash
git clone https://github.com/Plabss/Office-Management-System-for-a-Study-abroad-agency.git
```

2. Install dependencies for backend
```bash
cd server
npm install
```

3. Install dependencies for frontend
```bash
cd ../client
npm install
```

4. Create a .env file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

5. Start the backend server
```bash
cd server
npm start
```

6. Start the frontend application
```bash
cd client
npm start
```

## Project Structure

```
project/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── assets/        # Static assets
│   │   ├── components/    # Reusable components
│   │   ├── views/         # Page components
│   │   ├── navigations/   # Navigation configurations
│   │   └── private-routes/# Protected route components
│   └── public/            # Public assets
└── server/                # Backend application
    ├── config/           # Configuration files
    ├── controllers/      # Request handlers
    ├── middlewares/     # Custom middlewares
    ├── models/          # Database models
    ├── routes/          # API routes
    └── services/        # Business logic
```
