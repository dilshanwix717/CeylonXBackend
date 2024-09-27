const ProjectRequest = require('../models/projectRequestModel')
const EmailController = require('./emailController');


// Add a projectRequest post
const addProjectRequest = async (req, res) => {
    try {
        const { name, company, description, email, referral } = req.body;

        // Check if all fields are filled
        if (!description || !company || !name || !email || !referral) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        // Create a new projectRequest post
        const newProjectRequest = new ProjectRequest({
            projectRequestId: "ProjectRequestID-1",
            name,
            company,
            description,
            email,
            scheduled: false,
            referral,
            checked: false,
        });

        // Save the projectRequest post to the database
        const savedProjectRequest = await newProjectRequest.save();

        // Send project request email
        const emailSent = await EmailController.sendProjectRequestEmail(req, res);

        // Send project request confirmation email
        // const confirmEmailSent = await EmailController.sendProjectRequestConfirmEmail(req, res);

        // Return the saved project request
        //return res.json(savedProjectRequest);

        if (emailSent && savedProjectRequest) {
            return res.json({ message: 'Project request sent successfully' });
        } else {
            return res.json({ error: 'Error occurred while sending project request' });
        }

    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while submitting a project request'
        });
    }
};



// Get all projectRequest posts
const getAllProjectRequests = async (req, res) => {
    try {
        const projectRequests = await ProjectRequest.find().sort({ createdAt: -1 });

        return res.json(projectRequests);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching projectRequest posts'
        });
    }
};

// Get a projectRequest post by ProjectRequestId
const getProjectRequestById = async (req, res) => {
    try {
        const projectRequestId = req.params.id;
        const projectRequest = await ProjectRequest.findOne({ projectRequestId: projectRequestId });

        if (!projectRequest) {
            return res.json({
                error: 'ProjectRequest not found'
            });
        }
        return res.json(projectRequest);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching projectRequest post'
        });
    }
};

// Update the checked status of a job application
const updateCheckedStatus = async (req, res) => {
    try {
        const projectRequestId = req.params.id;
        const projectRequest = await ProjectRequest.findOne({ projectRequestId: projectRequestId });

        if (!projectRequest) {
            return res.json({
                error: 'ProjectRequest not found'
            });
        }

        // Check if the current status is false and will be toggled to true
        const wasUnchecked = !projectRequest.checked;

        // Toggle the checked status
        projectRequest.checked = !projectRequest.checked;

        // Save the updated project request to the database
        const updatedProjectRequest = await projectRequest.save();

        // Only send the email if the status was false and is now true
        if (wasUnchecked && projectRequest.checked) {
            const confirmEmailSent = await EmailController.sendProjectRequestConfirmEmail(projectRequest);

            // Return success message only if email was sent successfully and request was updated
            if (confirmEmailSent && updatedProjectRequest) {
                return res.json({ message: 'Project request checked and email sent successfully' });
            } else {
                return res.json({ error: 'Error occurred while checking project request or sending email' });
            }
        }

        // If no email needs to be sent, just return success for updating the status
        return res.json({ message: 'Project request checked status updated successfully' });

    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while checking project request'
        });
    }
};


const getCategoryCounts = async (req, res) => {
    try {
        const categoryCounts = await ProjectRequest.aggregate([
            {
                $group: {
                    _id: { $cond: { if: { $eq: ["$meetingScheduled", true] }, then: "scheduled", else: "pending" } },
                    count: { $sum: 1 }
                }
            }
        ]);
        // Define both categories with a default count of 0
        const result = {
            scheduled: 0,
            pending: 0
        };
        // Update the result object with the actual counts
        categoryCounts.forEach(categoryCount => {
            result[categoryCount._id] = categoryCount.count;
        });
        // Format the result into an array
        const formattedCategoryCounts = [
            { name: 'scheduled', count: result.scheduled },
            { name: 'pending', count: result.pending }
        ];
        return res.json(formattedCategoryCounts);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching category counts'
        });
    }
};


module.exports = { addProjectRequest, getAllProjectRequests, getProjectRequestById, updateCheckedStatus, getCategoryCounts };