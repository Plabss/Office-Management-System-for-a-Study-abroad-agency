const express = require("express");
const app = express();

const cors = require("cors");
const bodyParser = require("body-parser");


const superAdminRoute = require("./Routes/v1/superAdmin.route");

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/uploads", express.static("./uploads"));

app.use('/api/v1/super-admin',superAdminRoute)



app.get("/", (req, res) => {
  res.send("Route is working! YaY!");
});

module.exports = app;
