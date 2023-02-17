const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Setting Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");
// Using Routes
app.use("/api/projects", projectsRoutes);
app.use("/api/auth", usersRoutes);

app.get("/", (req, res) => {
  res.send(`<h1>Status 200</h1>`);
});

module.exports = app;
