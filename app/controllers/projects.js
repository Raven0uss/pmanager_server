const Project = require("../models/projects");
const getUserId = require("../functions/getUserId");
const isJsonString = require("../functions/isJsonString");

exports.getProject = async (req, res) => {
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
    return res.status(500).json(error);
  }
};

exports.getProjects = async (req, res) => {
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
exports.createProject = async (req, res) => {
  console.log("createProject: [POST] /projects/createProject");
  try {
    if (!isJsonString(req.body.content)) {
      return res.status(400).json("Bad Request - bad json");
    }
    if (!req.body.name) {
      return res.status(400).json("Bad Request - name is empty");
    }
    const existingProjects = await Project.findAll({
      where: {
        user_id: getUserId(req),
      },
      attributes: ["name"],
    });

    const projectsList = existingProjects.map((project) => project.name);
    if (projectsList.includes(req.body.name)) {
      return res.status(400).json("Bad Request - name already exist");
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
    return res.status(400).json("Bad Request");
  }
};

exports.deleteProjects = async (req, res) => {
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

exports.updateProject = async (req, res) => {
  console.log("updateProject: [PUT] /projects/updateProject?project_id=X");
  try {
    const PROJECT_MODEL = {
      name: req.body.name,
      content: req.body.content,
    };

    const id = req.query.project_id;
    if (!id) {
      return res.status(400).json("Bad Request");
    }

    if (!isJsonString(req.body.content)) {
      return res.status(400).json("Bad Request - bad json");
    }
    if (!req.body.name) {
      return res.status(400).json("Bad Request - name is empty");
    }

    const currentProject = await Project.findOne({
      where: { id, user_id: getUserId(req) },
      attributes: ["name"],
    });
    const currentName = currentProject.name;

    const existingProjects = await Project.findAll({
      where: {
        user_id: getUserId(req),
      },
      attributes: ["name"],
    });

    const projectsList = existingProjects
      .map((project) => project.name)
      .filter((name) => name !== currentName);

    if (projectsList.includes(req.body.name)) {
      return res.status(400).json("Bad Request - name already exist");
    }

    try {
      const p = await Project.update(PROJECT_MODEL, {
        where: { id, user_id: getUserId(req) },
      });
      return res.status(200).json(p);
    } catch (error) {
      return res.status(500).json(error);
    }
  } catch (error) {
    return res.status(400).json("Bad Request");
  }
};
