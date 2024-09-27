const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const { addWorkPost, getAllWorks, getAllThumbnailImages, getWorkById, getWorkTextById, updateWorkPost, deleteWorkPost, createWorkCategory, getWorkCategoryCounts } = require('../controllers/workController');

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
    '/createWorkPost',
    upload.fields([
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'mainImage', maxCount: 1 },
        { name: 'otherImage', maxCount: 1 },
        { name: 'designImage', maxCount: 3 },
        { name: 'frontendImage', maxCount: 3 },
        { name: 'backendImage', maxCount: 3 },
        { name: 'timelineImage', maxCount: 1 },
        { name: 'colorImage', maxCount: 1 },
        { name: 'headingFontImage', maxCount: 1 },
        { name: 'bodyFontImage', maxCount: 1 },
        { name: 'buttonFontImage', maxCount: 1 },
    ]),
    addWorkPost
);

router.put(
    '/updateWorkPost/:id',
    upload.fields([
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'mainImage', maxCount: 1 },
        { name: 'otherImage', maxCount: 1 },
        { name: 'designImage', maxCount: 3 },
        { name: 'frontendImage', maxCount: 3 },
        { name: 'backendImage', maxCount: 3 },
        { name: 'timelineImage', maxCount: 1 },
        { name: 'colorImage', maxCount: 1 },
        { name: 'headingFontImage', maxCount: 1 },
        { name: 'bodyFontImage', maxCount: 1 },
        { name: 'buttonFontImage', maxCount: 1 },

    ]),
    updateWorkPost
);


router.get('/getAllWorks', getAllWorks);
router.get('/getAllThumbnailImages', getAllThumbnailImages);
router.get('/getWorkById/:id', getWorkById);
router.get('/getWorkTextById/:id', getWorkTextById);
router.delete('/deleteWorkPost/:id', deleteWorkPost);
router.get('/getWorkCategoryCounts', getWorkCategoryCounts);
router.post('/createWorkCategory', createWorkCategory);


module.exports = router;
