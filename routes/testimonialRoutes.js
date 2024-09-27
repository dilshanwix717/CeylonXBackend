const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const { addTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');

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
router.post(
    '/createTestimonial',
    upload.fields([
        { name: 'image', maxCount: 1 }
    ]),
    addTestimonial
);
router.put(
    '/updateTestimonial/:id',
    upload.fields([
        { name: 'image', maxCount: 1 }
    ]),
    updateTestimonial
);
router.get('/getAllTestimonials', getAllTestimonials);
router.get('/getTestimonialById/:id', getTestimonialById);
router.delete('/deleteTestimonial/:id', deleteTestimonial);

module.exports = router;
