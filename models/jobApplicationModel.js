const mongoose = require('mongoose')
const { Schema } = mongoose

const jobApplicationSchema = new Schema({
    // Job Application ID (auto-generated)
    jobApplicationId: {
        type: String,
        required: true,
        unique: true,
    },
    // name of the job applicant
    name: {
        type: String,
        required: true,
    },
    // title of the job 
    title: {
        type: String,
        required: true,
    },
    // QA , SE, BA, UI/UX , Marketing, PM, HR
    category: {
        type: String,
        required: true,
    },
    // email
    email: {
        type: String,
        required: true,
    },
    //mobile
    mobile: {
        type: String,
        required: true,
    },
    referral: {
        type: String,
        required: true,
    },
    // checked or not
    checked: {
        type: Boolean,
        required: true,
    },
    cv: {
        type: Buffer,
        required: true,
    },
    cvName: { //  to store the original filename
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// Pre-save hook to auto-generate the jobApplicationId
jobApplicationSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastJobApplication = await mongoose.model('JobApplication').findOne().sort({ createdAt: -1 });
        // get the last job application ID and increment it by 1 if there is no job application ID then set lastJobApplicationID to 0 and increment it by 1
        const lastJobApplicationID = lastJobApplication ? parseInt(lastJobApplication.jobApplicationId.split('-')[1]) : 0;
        this.jobApplicationId = `JobApplicationID-${lastJobApplicationID + 1}`;
    }
    next();
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema)