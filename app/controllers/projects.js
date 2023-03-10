const { isNil } = require("lodash");
const {
  BAD_JSON,
  P_NAME_EMPTY,
  P_NAME_EXIST,
  BAD_REQUEST,
} = require("../../statusMessages");
const getUserId = require("../functions/getUserId");
const isJsonString = require("../functions/isJsonString");

// Get Single Project
exports.getProject = (Project) => async (req, res) => {
  console.log("getProject: [GET] /projects/getProject?project_id=X");
  try {
    const project = await Project.findOne({
      where: {
        id: req.query.project_id,
        user_id: getUserId(req),
      },
    });
    return res.status(200).json(project);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// Get All Projects (without JSON to avoid heavy contents)
exports.getProjects = (Project) => async (req, res) => {
  console.log("getProjects: [GET] /projects/getProjects");
  try {
    const projects = await Project.findAll({
      where: {
        user_id: getUserId(req),
      },
      attributes: {
        exclude: ["content"],
      },
    });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Create Project
exports.createProject = (Project) => async (req, res) => {
  console.log("createProject: [POST] /projects/createProject");
  try {
    // Check if the JSON is valid
    if (!isJsonString(req.body.content)) {
      return res.status(400).json(BAD_JSON);
    }
    if (!req.body.name) {
      return res.status(400).json(P_NAME_EMPTY);
    }

    // Get existing projects of the user
    const existingProjects = await Project.findAll({
      where: {
        user_id: getUserId(req),
      },
      attributes: ["name"],
    });

    // Check if the user has already a project with the name requested
    const projectsList = existingProjects.map((project) => project.name);
    if (projectsList.includes(req.body.name)) {
      return res.status(400).json(P_NAME_EXIST);
    }

    const PROJECT_MODEL = {
      user_id: getUserId(req),
      name: req.body.name,
      content: req.body.content,
    };

    try {
      const project = await Project.create(PROJECT_MODEL);
      return res.status(201).json(project);
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(400).json(BAD_REQUEST);
  }
};

// Delete one or multiple projects. Avoid to have a single request just for one deletion
exports.deleteProjects = (Project) => async (req, res) => {
  console.log("deleteProjects: [DELETE] /projects/deleteProjects?ids=X;X2");
  try {
    const ids = req.query.ids.split(";");
    const p = await Project.destroy({
      where: { id: ids, user_id: getUserId(req) },
    });
    return res.status(200).json(p);
  } catch (error) {
    return res.status(500).json(error);
  }
};

// Update a project of a user
exports.updateProject = (Project) => async (req, res) => {
  console.log("updateProject: [PUT] /projects/updateProject?project_id=X");
  try {
    const PROJECT_MODEL = {
      name: req.body.name,
      content: req.body.content,
    };

    const id = req.query.project_id;

    // Check if the JSON is valid
    if (!isJsonString(req.body.content)) {
      return res.status(400).json(BAD_JSON);
    }
    if (!req.body.name) {
      return res.status(400).json(P_NAME_EMPTY);
    }

    // Get the name of the current project to exclude it from the check bloc after
    const currentProject = await Project.findOne({
      where: { id, user_id: getUserId(req) },
      attributes: ["name"],
    });

    if (isNil(currentProject) || isNil(currentProject.name)) {
      return res.status(400).json(BAD_REQUEST);
    }

    const currentName = currentProject.name;

    // Get all the projects owned by the user
    const existingProjects = await Project.findAll({
      where: {
        user_id: getUserId(req),
      },
      attributes: ["name"],
    });

    // As for creation, check if name is already set for another project
    // but excluding the current one (which can throw an error)
    const projectsList = existingProjects
      .map((project) => project.name)
      .filter((name) => name !== currentName);

    if (projectsList.includes(req.body.name)) {
      return res.status(400).json(P_NAME_EXIST);
    }

    try {
      const project = await Project.update(PROJECT_MODEL, {
        where: { id, user_id: getUserId(req) },
        returning: true,
        plain: true,
      });

      return res.status(200).json(project[1]);
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(400).json(BAD_REQUEST);
  }
};
