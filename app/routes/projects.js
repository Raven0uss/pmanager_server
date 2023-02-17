const express = require('express');
const router = express.Router();

const projectsController = require('../controllers/projects');

const auth = require('../middleware/auth');

router.get('/getProject', auth, projectsController.getProject);
router.get('/getProjects', auth, projectsController.getProjects);
router.post('/createProject', auth, projectsController.createProject);
router.put('/updateProject', auth, projectsController.updateProject);
router.delete('/deleteProjects', auth, projectsController.deleteProjects);

module.exports = router;