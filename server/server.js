const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = require("./app");

mongoose.connect(process.env.MONGO_URL).then(() => console.log("Database connection established"))
.catch(() => console.log("Database connection failed"));

const port = 8080;

app.listen(port, () => {
  console.log(`App is running at port 8080`);
});