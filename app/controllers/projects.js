const Project = require("../models/projects");
const getUserId = require("../middleware/getUserId");
const isJsonString = require("../functions/isJsonString");

exports.getProject = async (req, res, next) => {
  console.log("getProject: [GET] /project/:id");
  try {
    const PROJECTS = await Project.findOne({
      where: {
        id: req.query.project_id,
        user_id: getUserId(req),
      },
    });
    return res.status(200).json(PROJECTS);
  } catch (error) {
    return res.status(500).json(error);
  }
};

exports.getProjects = async (req, res, next) => {
  console.log("getProjects: [GET] /projects/");
  try {
    const PROJECTS = await Project.findAll({
      where: {
        user_id: getUserId(req),
      },
      attributes: {
        exclude: ["content"],
      },
    });
    return res.status(200).json(PROJECTS);
  } catch (error) {
    return res.status(500).json(error);
  }
};
exports.createProject = async (req, res, next) => {
  console.log("createProject: [POST] /projects/");
  try {
    console.log(req.body.content);
    if (!isJsonString(req.body.content)) {
      return res.status(400).json("Bad Request - bad json");
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

exports.deleteProjects = async (req, res, next) => {
  console.log("deleteProjects: [DELETE] /projects/:ids");
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

exports.updateProject = async (req, res, next) => {
  console.log("updateProject: [PUT] /projects/:id");
  try {
    const PROJECT_MODEL = {
      name: req.body.name,
      content: req.body.content,
    };

    try {
      const id = req.params.id;
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
