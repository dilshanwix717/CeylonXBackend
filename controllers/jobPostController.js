const JobPost = require('../models/jobPostModel')

// Add a job post
const addJobPost = async (req, res) => {
    try {
        const { category, title, environment, whatYouWillDo, whatWeExpectYouToHave, whatItsGreatIfYouHave } = req.body;

        // Check if all fields are filled
        if (!category || !title || !environment || !whatYouWillDo || !whatWeExpectYouToHave || !whatItsGreatIfYouHave) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        // Create a new job post
        const newJobPost = new JobPost({
            jobPostId: "jobPostID-1",
            category,
            title,
            environment,
            whatYouWillDo,
            whatWeExpectYouToHave,
            whatItsGreatIfYouHave,
        });

        // Save the job post to the database
        const savedJobPost = await newJobPost.save();
        return res.json(savedJobPost);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while creating a job post'
        });
    }
}

// Get all job posts
const getAllJobPosts = async (req, res) => {
    try {
        const jobPosts = await JobPost.find({});
        return res.json(jobPosts);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while retrieving job posts'
        });
    }
}

// Get job post by ID
const getJobPostById = async (req, res) => {
    try {
        const jobPostId = req.params.id;
        const jobPost = await JobPost.findOne({ jobPostId });
        if (!jobPost) {
            return res.json({
                error: 'Job post not found'
            });
        }
        return res.json(jobPost);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while retrieving job post'
        });
    }
}

module.exports = { addJobPost, getAllJobPosts, getJobPostById };