const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const { addBlogPost, getAllBlogs, getAllThumbnailBlogImages, getBlogById, getBlogTextById, updateBlogPost, deleteBlogPost, createBlogCategory, getBlogCategoryCounts } = require('../controllers/blogController');

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
    '/createBlogPost',
    upload.fields([
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'mainImage', maxCount: 1 }
    ]),
    addBlogPost
);
router.put(
    '/updateBlogPost/:id',
    upload.fields([
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'mainImage', maxCount: 1 }
    ]),
    updateBlogPost
);

router.get('/getAllBlogs', getAllBlogs);
router.get('/getAllThumbnailBlogImages', getAllThumbnailBlogImages);
router.get('/getBlogById/:id', getBlogById);
router.get('/getBlogTextById/:id', getBlogTextById);
router.get('/getBlogCategoryCounts', getBlogCategoryCounts);
router.post('/createBlogCategory', createBlogCategory);
router.delete('/deleteBlogPost/:id', deleteBlogPost);

module.exports = router;
