const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const { addProjectRequest, getAllProjectRequests, getProjectRequestById, updateCheckedStatus, getCategoryCounts } = require('../controllers/projectRequestController');

//middleware
router.use(
    cors({
        origin: '*',
        credentials: true,
        // methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // headers: ['Content-Type', 'Authorization']
    })
);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// API routes
router.post('/createProjectRequest', addProjectRequest);
router.put('/projectRequestRoutes/updateCheckedStatus/:id', updateCheckedStatus);
router.get('/getAllProjectRequests', getAllProjectRequests);
router.get('/getProjectRequestById/:id', getProjectRequestById);
router.get('/getRequestCategoryCounts', getCategoryCounts);

module.exports = router;
