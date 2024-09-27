const express = require('express')
const router = express.Router()
const cors = require('cors')
const multer = require('multer');
const { addJobPost, getAllJobPosts, getJobPostById, } = require('../controllers/jobPostController')
const { addJobApplication, getAllJobApplications, getJobApplicationById, updateCheckedStatus, getCategoryCounts } = require('../controllers/jobApplicationController')


//middleware
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.use(
    cors({
        origin: '*',
        credentials: true,
        // methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // headers: ['Content-Type', 'Authorization']
    })
)

// API routes
router.post('/createJobPost', addJobPost)
router.get('/getAllJobPosts', getAllJobPosts)
router.get('/getJobPostById/:id', getJobPostById)


//Job  applications


// API routes
router.post(
    '/createJobApplication',
    upload.fields([
        { name: 'cv', maxCount: 1 }
    ]),
    addJobApplication
);
router.get('/getAllJobApplications', getAllJobApplications)
router.get('/getJobApplicationById/:id', getJobApplicationById)
router.get('/getCategoryCounts', getCategoryCounts)
router.put('/updateCheckedStatus/:id', updateCheckedStatus);


module.exports = router