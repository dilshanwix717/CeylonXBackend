const JobApplication = require('../models/jobApplicationModel')
const EmailController = require('./emailController');

// Add a jobApplication post
const addJobApplication = async (req, res) => {
    try {
        const { name, title, category, email, mobile, referral } = req.body;

        // Check if all fields are filled
        if (!category || !title || !name || !email || !mobile || !referral) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        const cvFile = req.files['cv'][0]; // Access the uploaded file
        if (!cvFile) {
            return res.json({
                error: 'Please upload your CV'
            });
        }

        const cv = cvFile.buffer;
        const cvName = cvFile.originalname; // Access the original file name

        // Create a new jobApplication post
        const newJobApplication = new JobApplication({
            jobApplicationId: "JobApplicationID-1",
            name,
            title,
            category,
            email,
            mobile,
            referral,
            cv,
            cvName,
            checked: false,
        });

        // Save the jobApplication post to the database
        const savedJobApplication = await newJobApplication.save();

        // Send jobApplication confirmation email
        await EmailController.sendJobApplicationEmail(req, res);

        return res.json(savedJobApplication);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while submitting a job application'
        });
    }
};


// Get all jobApplication posts
const getAllJobApplications = async (req, res) => {
    try {
        const jobApplications = await JobApplication.find().sort({ createdAt: -1 });

        // Convert the buffers to Base64 strings
        const formattedJobApplications = jobApplications.map(jobApplication => ({
            ...jobApplication._doc,
            cv: jobApplication.cv.toString('base64'), // Convert CV to Base64
            // cvName: jobApplication.cvName, // Include the original filename
        }));

        return res.json(formattedJobApplications);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching jobApplication posts'
        });
    }
};

// Get a jobApplication post by JobApplicationId
const getJobApplicationById = async (req, res) => {
    try {
        const jobApplicationId = req.params.id;
        const jobApplication = await JobApplication.findOne({ jobApplicationId: jobApplicationId });

        if (!jobApplication) {
            return res.json({
                error: 'JobApplication not found'
            });
        }

        // Convert the buffers to Base64 strings
        const formattedJobApplication = {
            ...jobApplication._doc,
            cv: jobApplication.cv.toString('base64')
        };

        return res.json(formattedJobApplication);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching jobApplication post'
        });
    }
};

// Update the checked status of a job application
const updateCheckedStatus = async (req, res) => {
    try {
        const jobApplicationId = req.params.id;
        const jobApplication = await JobApplication.findOne({ jobApplicationId: jobApplicationId });
        if (!jobApplication) {
            return res.json({
                error: 'JobApplication not found'
            });
        }
        // Check if the current status is false and will be toggled to true
        const wasUnchecked = !jobApplication.checked;
        // Toggle the checked status
        jobApplication.checked = !jobApplication.checked;
        // Save the updated job application to the database
        const updatedJobApplication = await jobApplication.save();
        // Only send the email if the status was false and is now true
        if (wasUnchecked && jobApplication.checked) {
            const confirmEmailSent = await EmailController.sendJobApplicationConfirmEmail(jobApplication);
            // Return success message only if email was sent successfully and request was updated
            if (confirmEmailSent && updatedJobApplication) {
                return res.json({ message: 'Job application checked and email sent successfully' });
            } else {
                return res.json({ error: 'Error occurred while checking job application or sending email' });
            }
        }
        // If no email needs to be sent, just return success for updating the status
        return res.json({ message: 'Job application checked status updated successfully' });
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while checking job application'
        });
    }
};

const getCategoryCounts = async (req, res) => {
    try {
        const categoryCounts = await JobApplication.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedCategoryCounts = categoryCounts.map(categoryCount => ({
            name: categoryCount._id,
            count: categoryCount.count
        }));

        return res.json(formattedCategoryCounts);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching category counts'
        });
    }
};

module.exports = { addJobApplication, getAllJobApplications, getJobApplicationById, updateCheckedStatus, getCategoryCounts };