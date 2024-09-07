const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Routes imports
const employeeRoute = require('./routes/v1/employee.route');
const authRoute = require('./routes/v1/auth.route');
const studentRoute = require('./routes/v1/student.route');
const visitorRoute = require('./routes/v1/visitor.route');
const courseRoute = require('./routes/v1/course.route');
const visaRoute = require('./routes/v1/visa.route');
const notificationsRoute = require('./routes/v1/notification.route');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/v1/employees', employeeRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/students', studentRoute);
app.use('/api/v1/visitors', visitorRoute);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/visas', visaRoute);
app.use('/notifications', notificationsRoute)

app.get('/', (req, res) => {
  res.send('Route is working! YaY!');
});

module.exports = app;
