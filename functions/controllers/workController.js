const Work = require('../models/workModel')
const WorkCategory = require('../models/workCategoryModel');
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Add a work post
const addWorkPost = async (req, res) => {
    try {
        const { name, description, category, keywords, brief, challenges, solution } = req.body;
        // Check if all fields are filled
        if (!category || !description || !name || !keywords || !brief || !challenges || !solution) {
            return res.json({ error: 'Please fill all fields and try again' });
        }
        if (!req.files) {
            return res.json({ error: 'No files were uploaded' });
        }
        // Check for all required images
        if (!req.files.thumbnailImage || !req.files.mainImage || !req.files.otherImage || !req.files.timelineImage || !req.files.colorImage || !req.files.headingFontImage || !req.files.bodyFontImage || !req.files.buttonFontImage) {
            return res.json({ error: 'All the images are required' });
        }
        // Split the keywords by comma and trim spaces
        const keywordArray = keywords.split('#').filter(keyword => keyword.trim() !== '');
        // Validate keyword length
        if (keywordArray.length < 1 || keywordArray.length > 5) {
            return res.json({ error: 'Please enter between 1 and 5 keywords' });
        }
        // Extract design details
        const designs = req.files.designImage.map((file, index) => ({
            designName: req.body.designName[index],
            designImage: file.buffer,
        }));
        if (designs.length > 3) {
            return res.json({ error: 'You can add up to 3 design items only' });
        }
        // Extract frontend details
        const frontends = req.files.frontendImage.map((file, index) => ({
            frontendName: req.body.frontendName[index],
            frontendImage: file.buffer,
        }));
        if (frontends.length > 3) {
            return res.json({ error: 'You can add up to 3 frontend items only' });
        }
        // Extract backend details
        const backends = req.files.backendImage.map((file, index) => ({
            backendName: req.body.backendName[index],
            backendImage: file.buffer,
        }));
        if (backends.length > 3) {
            return res.json({ error: 'You can add up to 3 backend items only' });
        }

        const thumbnailImage = req.files.thumbnailImage[0].buffer;
        const mainImage = req.files.mainImage[0].buffer;
        const otherImage = req.files.otherImage[0].buffer;
        const timelineImage = req.files.timelineImage[0].buffer;
        const colorImage = req.files.colorImage[0].buffer;
        const headingFontImage = req.files.headingFontImage[0].buffer;
        const bodyFontImage = req.files.bodyFontImage[0].buffer;
        const buttonFontImage = req.files.buttonFontImage[0].buffer;
        // Create new work post
        const newWork = new Work({
            WorkId: "WorkID-1",
            name,
            description,
            category,
            keywords: keywordArray,
            thumbnailImage,
            mainImage,
            otherImage,
            brief,
            challenges,
            solution,
            timelineImage,
            colorImage,
            headingFontImage,
            bodyFontImage,
            buttonFontImage,
            designs,
            frontends,
            backends
        });
        // Save the work post to the database
        const savedWork = await newWork.save();
        return res.json(savedWork);
    } catch (error) {
        console.log(error);
        return res.json({ error: 'Error occurred while creating a work post' });
    }
};


// Get all work posts excluding image fields
const getAllWorks = async (req, res) => {
    try {
        // Exclude the image fields by passing them as 0 in the select method
        const works = await Work.find({}, {
            thumbnailImage: 0,
            mainImage: 0,
            otherImage: 0,
            timelineImage: 0,
            colorImage: 0,
            headingFontImage: 0,
            bodyFontImage: 0,
            buttonFontImage: 0,
            "designs.designImage": 0,
            "frontends.frontendImage": 0,
            "backends.backendImage": 0
        }).sort({ createdAt: -1 });

        // Map through the results as you did before
        const formattedWorks = works.map(work => ({
            _id: work._id,
            WorkId: work.WorkId,
            name: work.name,
            description: work.description,
            category: work.category,
            keywords: work.keywords,
        }));

        return res.json(formattedWorks);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching work posts'
        });
    }
};


// Get all work thumbnail images
const getAllThumbnailImages = async (req, res) => {
    try {
        // Select only the thumbnailImage, _id, and WorkId fields
        const thumbnailImages = await Work.find({}, {
            thumbnailImage: 1,
            _id: 1,
            WorkId: 1
        });

        // Convert the thumbnailImage buffers to Base64 strings
        const formattedThumbnailImages = thumbnailImages.map(image => ({
            _id: image._id,
            WorkId: image.WorkId,
            thumbnailImage: image.thumbnailImage.toString('base64')
        }));

        return res.json(formattedThumbnailImages);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching thumbnail images'
        });
    }
};



const getWorkTextById = async (req, res) => {
    try {
        const WorkId = req.params.id;
        // Exclude the image fields by passing them as 0 in the select method
        const work = await Work.findOne(
            { WorkId: WorkId },
            {
                thumbnailImage: 0,
                mainImage: 0,
                otherImage: 0,
                timelineImage: 0,
                colorImage: 0,
                headingFontImage: 0,
                bodyFontImage: 0,
                buttonFontImage: 0,
                "designs.designImage": 0, // Exclude image but include the name
                "frontends.frontendImage": 0, // Exclude image but include the name
                "backends.backendImage": 0, // Exclude image but include the name
            }
        );

        if (!work) {
            return res.status(404).json({
                error: 'Work not found'
            });
        }

        // Map through the result to include designName, frontendName, and backendName
        const formattedWork = {
            _id: work._id,
            WorkId: work.WorkId,
            name: work.name,
            description: work.description,
            category: work.category,
            keywords: work.keywords,
            brief: work.brief,
            challenges: work.challenges,
            solution: work.solution,
            designs: work.designs.map(design => ({
                designName: design.designName,
            })),
            frontends: work.frontends.map(frontend => ({
                frontendName: frontend.frontendName,
            })),
            backends: work.backends.map(backend => ({
                backendName: backend.backendName,
            })),
        };

        return res.status(200).json(formattedWork);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error occurred while fetching work post'
        });
    }
};


// Get a work images by WorkId
const getWorkById = async (req, res) => {
    try {
        const WorkId = req.params.id;
        const work = await Work.findOne({ WorkId: WorkId });
        if (!work) {
            return res.json({
                error: 'Work not found'
            });
        }

        // Convert the buffers to Base64 strings
        const formattedWork = {
            ...work._doc,
            thumbnailImage: work.thumbnailImage.toString('base64'),
            mainImage: work.mainImage.toString('base64'),
            otherImage: work.otherImage.toString('base64'),
            timelineImage: work.timelineImage.toString('base64'),
            colorImage: work.colorImage.toString('base64'),
            headingFontImage: work.headingFontImage.toString('base64'),
            bodyFontImage: work.bodyFontImage.toString('base64'),
            buttonFontImage: work.buttonFontImage.toString('base64'),
            designs: work.designs.map(design => ({
                designName: design.designName,
                designImage: design.designImage.toString('base64'),
            })),
            frontends: work.frontends.map(frontend => ({
                frontendName: frontend.frontendName,
                frontendImage: frontend.frontendImage.toString('base64'),
            })),
            backends: work.backends.map(backend => ({
                backendName: backend.backendName,
                backendImage: backend.backendImage.toString('base64'),
            })),
        };

        return res.json(formattedWork);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching work post'
        });
    }
};


// Update a work post by WorkId
const updateWorkPost = async (req, res) => {
    try {
        const WorkId = req.params.id;
        const work = await Work.findOne({ WorkId: WorkId });

        if (!work) {
            return res.json({
                error: 'Work not found'
            });
        }

        const { name, description, category, keywords, brief, challenges, solution } = req.body;

        // Check if all fields are filled
        if (!category || !description || !name || !keywords || !brief || !challenges || !solution) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        if (req.files) {
            if (req.files.thumbnailImage) {
                work.thumbnailImage = req.files.thumbnailImage[0].buffer;
            }
            if (req.files.mainImage) {
                work.mainImage = req.files.mainImage[0].buffer;
            }
            if (req.files.otherImage) {
                work.otherImage = req.files.otherImage[0].buffer;
            }
            if (req.files.timelineImage) {
                work.timelineImage = req.files.timelineImage[0].buffer;
            }
            if (req.files.colorImage) {
                work.colorImage = req.files.colorImage[0].buffer;
            }
            if (req.files.headingFontImage) {
                work.headingFontImage = req.files.headingFontImage[0].buffer;
            }
            if (req.files.bodyFontImage) {
                work.bodyFontImage = req.files.bodyFontImage[0].buffer;
            }
            if (req.files.buttonFontImage) {
                work.buttonFontImage = req.files.buttonFontImage[0].buffer;
            }
        }

        work.name = name;
        work.description = description;
        work.category = category;
        work.keywords = keywords.split('#').filter(keyword => keyword.trim() !== '');
        work.brief = brief;
        work.challenges = challenges;
        work.solution = solution;

        // Update designs, frontends, and backends if new files are uploaded
        if (req.files.designImage) {
            work.designs = req.files.designImage.map((file, index) => ({
                designName: req.body.designName[index],
                designImage: file.buffer,
            }));
        }
        if (req.files.frontendImage) {
            work.frontends = req.files.frontendImage.map((file, index) => ({
                frontendName: req.body.frontendName[index],
                frontendImage: file.buffer,
            }));
        }
        if (req.files.backendImage) {
            work.backends = req.files.backendImage.map((file, index) => ({
                backendName: req.body.backendName[index],
                backendImage: file.buffer,
            }));
        }

        // Save the updated work post to the database
        const updatedWork = await work.save();

        // Convert the buffers to Base64 strings
        const formattedWork = {
            ...updatedWork._doc,
            thumbnailImage: updatedWork.thumbnailImage.toString('base64'),
            mainImage: updatedWork.mainImage.toString('base64'),
            otherImage: updatedWork.otherImage.toString('base64'),
            timelineImage: updatedWork.timelineImage.toString('base64'),
            colorImage: updatedWork.colorImage.toString('base64'),
            headingFontImage: updatedWork.headingFontImage.toString('base64'),
            bodyFontImage: updatedWork.bodyFontImage.toString('base64'),
            buttonFontImage: updatedWork.buttonFontImage.toString('base64'),
        };

        return res.json(formattedWork);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while updating work post'
        });
    }
};

// Delete a work post by WorkId
const deleteWorkPost = async (req, res) => {
    try {
        const WorkId = req.params.id;
        const work = await Work.findOneAndDelete({ WorkId: WorkId });

        if (!work) {
            return res.json({
                error: 'Work not found'
            });
        }
        return res.json({
            message: 'Work post deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while deleting work post'
        });
    }
};


// Create a new work category
const createWorkCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Check if all fields are filled
        if (!name) {
            return res.json({
                error: 'Please fill category name'
            });
        }
        // Create a new work post
        const newWorkCategory = new WorkCategory({
            name,
            workCount: 0
        });
        // Save the work post to the database
        const savedWorkCategory = await newWorkCategory.save();
        return res.json(savedWorkCategory);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while creating a work category'
        });
    }
};


const getWorkCategoryCounts = async (req, res) => {
    try {
        // Get all work categories
        const workCategories = await WorkCategory.find();

        // Map over each category and count associated works
        const workCategoryCounts = await Promise.all(
            workCategories.map(async (workCategory) => {
                const count = await Work.countDocuments({ category: workCategory.name });
                return {
                    name: workCategory.name,
                    count,
                };
            })
        );

        return res.json(workCategoryCounts);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching work category counts'
        });
    }
};


module.exports = { addWorkPost, getAllWorks, getAllThumbnailImages, getWorkById, getWorkTextById, updateWorkPost, deleteWorkPost, createWorkCategory, getWorkCategoryCounts };