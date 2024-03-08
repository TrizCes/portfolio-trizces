const express = require('express');
const multer = require('./middlewares/multer');
const cors = require('cors');
const { postProject, putProject, getProjects, deleteProject } = require('./controllers/projects.js');

const router = express.Router(); 

router.use(cors());

router.get('/', (req, res) => res.send('Express on Vercel'));

router.post('/project', multer.single('image'), postProject);
router.put('/project/:id', multer.single('image'), putProject);
router.get('/project', getProjects);
router.delete('/project/:id', deleteProject);

module.exports = router; 
