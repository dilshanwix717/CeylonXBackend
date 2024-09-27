const Testimonial = require('../models/testimonialModel')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Add a testimonial post
const addTestimonial = async (req, res) => {
    try {
        const { name, description, designation } = req.body;
        // Check if all fields are filled
        if (!designation || !description || !name) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        if (!req.files) {
            return res.json({
                error: 'No files were uploaded'
            });
        }

        if (!req.files.image) {
            return res.json({
                error: 'Client image is required'
            });
        }
        const image = req.files.image[0].buffer;

        // Create a new testimonial post
        const newTestimonial = new Testimonial({
            TestimonialId: "TestimonialID-1",
            name,
            description,
            designation,
            image: image,
        });
        // Save the testimonial post to the database
        const savedTestimonial = await newTestimonial.save();

        return res.json(savedTestimonial);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while creating a testimonial post'
        });
    }
}

// Get all testimonial posts
const getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        // Convert the buffers to Base64 strings
        const formattedTestimonials = testimonials.map(testimonial => ({
            _id: testimonial._id,
            TestimonialId: testimonial.TestimonialId,
            name: testimonial.name,
            description: testimonial.description,
            designation: testimonial.designation,
            image: testimonial.image.toString('base64'),
        }));
        return res.json(formattedTestimonials);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching testimonial posts'
        });
    }
};

// Get a testimonial post by TestimonialId
const getTestimonialById = async (req, res) => {
    try {
        const TestimonialId = req.params.id;
        const testimonial = await Testimonial.findOne({ TestimonialId: TestimonialId });

        if (!testimonial) {
            return res.json({
                error: 'Testimonial not found'
            });
        }
        // Convert the buffers to Base64 strings
        const formattedTestimonial = {
            ...testimonial._doc,
            image: testimonial.image.toString('base64'),
        };
        return res.json(formattedTestimonial);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching testimonial post'
        });
    }
};

// Update a testimonial post by TestimonialId
const updateTestimonial = async (req, res) => {
    try {
        const TestimonialId = req.params.id;
        const testimonial = await Testimonial.findOne({ TestimonialId: TestimonialId });
        if (!testimonial) {
            return res.json({
                error: 'Testimonial not found'
            });
        }
        const { name, description, designation } = req.body;
        // Check if all fields are filled
        if (!designation || !description || !name) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }
        if (req.files) {
            if (req.files.image) {
                testimonial.image = req.files.image[0].buffer;
            }
        }

        testimonial.name = name;
        testimonial.description = description;
        testimonial.designation = designation;

        // Save the updated testimonial post to the database
        const updatedTestimonial = await testimonial.save();

        // Convert the buffers to Base64 strings
        const formattedTestimonial = {
            ...updatedTestimonial._doc,
            image: updatedTestimonial.image.toString('base64')
        };

        return res.json(formattedTestimonial);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while updating testimonial post'
        });
    }
};

// Delete a testimonial post by TestimonialId
const deleteTestimonial = async (req, res) => {
    try {
        const TestimonialId = req.params.id;
        const testimonial = await Testimonial.findOneAndDelete({ TestimonialId: TestimonialId });

        if (!testimonial) {
            return res.json({
                error: 'Testimonial not found'
            });
        }
        return res.json({
            message: 'Testimonial post deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while deleting testimonial post'
        });
    }
};




module.exports = { addTestimonial, getAllTestimonials, getTestimonialById, updateTestimonial, deleteTestimonial };