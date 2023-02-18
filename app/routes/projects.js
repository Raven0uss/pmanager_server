const express = require("express");
const router = express.Router();

const Project = require("../models/projects");
const projectsController = require("../controllers/projects");

const auth = require("../middleware/auth");

router.get("/getProject", auth, projectsController.getProject(Project));
router.get("/getProjects", auth, projectsController.getProjects(Project));
router.post("/createProject", auth, projectsController.createProject(Project));
router.put("/updateProject", auth, projectsController.updateProject(Project));
router.delete(
  "/deleteProjects",
  auth,
  projectsController.deleteProjects(Project)
);

module.exports = router;
