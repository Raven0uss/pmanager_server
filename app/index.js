const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Setting Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Routes
const usersRoutes = require("./routes/users");
const projectsRoutes = require("./routes/projects");
// Using Routes
app.use("/api/projects", projectsRoutes);
app.use("/api/auth", usersRoutes);

// Alive Check
app.get("/", (req, res) => {
  res.send(`<h1>Server is alive</h1>`);
});

module.exports = app;
