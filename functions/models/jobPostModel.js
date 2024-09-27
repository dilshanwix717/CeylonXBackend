const mongoose = require('mongoose')
const { Schema } = mongoose

const jobPostSchema = new Schema({
    // Job Post ID (auto-generated)
    jobPostId: {
        type: String,
        required: true,
        unique: true,
    },
    // category of the job post
    category: {
        type: String,
        required: true,
    },
    // title of the job post
    title: {
        type: String,
        required: true,
    },
    // working environment of the job post
    environment: {
        type: String,
        required: true,
    },
    // what you will do in the job post
    whatYouWillDo: {
        type: String,
        required: true,
    },
    // what we expect you to have for the job post
    whatWeExpectYouToHave: {
        type: String,
        required: true,
    },
    // what it's great if you have for the job post
    whatItsGreatIfYouHave: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// Pre-save hook to auto-generate the jobPostId
jobPostSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastJobPost = await mongoose.model('JobPost').findOne().sort({ createdAt: -1 });
        // get the last job post ID and increment it by 1 if there is no job post ID then set lastJobPostID to 0 and increment it by 1
        const lastJobPostID = lastJobPost ? parseInt(lastJobPost.jobPostId.split('-')[1]) : 0;
        this.jobPostId = `JobPostID-${lastJobPostID + 1}`;
    }
    next();
});

module.exports = mongoose.model('JobPost', jobPostSchema)