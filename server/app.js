const express = require('express');
const dotenv = require("dotenv").config();

const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const employeeRoute = require('./Routes/v1/employee.route');
const authRoute = require('./Routes/v1/auth.route');
const studentRoute = require('./Routes/v1/student.route');
const courseRoute = require('./Routes/v1/course.route');

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
app.use('/api/v1/courses', courseRoute);


app.get('/', (req, res) => {
  res.send('Route is working! YaY!');
});

module.exports = app;
