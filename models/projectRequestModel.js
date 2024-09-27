const mongoose = require('mongoose')
const { Schema } = mongoose

const projectRequestSchema = new Schema({
    projectRequestId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    referral: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        required: true,
    },
    //scheduled or pending request
    meetingScheduled: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true
});

// Pre-save hook to auto-generate the projectRequestId
projectRequestSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastProjectRequest = await mongoose.model('ProjectRequest').findOne().sort({ createdAt: -1 });
        // get the last job application ID and increment it by 1 if there is no job application ID then set lastProjectRequestID to 0 and increment it by 1
        const lastProjectRequestID = lastProjectRequest ? parseInt(lastProjectRequest.projectRequestId.split('-')[1]) : 0;
        this.projectRequestId = `ProjectRequestID-${lastProjectRequestID + 1}`;
    }
    next();
});

module.exports = mongoose.model('ProjectRequest', projectRequestSchema)