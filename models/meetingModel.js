const mongoose = require('mongoose')
const { Schema } = mongoose

const meetingSchema = new Schema({
    meetingId: {
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
    // email
    email: {
        type: String,
        required: true,
    },
    meetingDate: {
        type: Date,
        required: false
    },
    meetingStartTime: {
        type: String,
        required: false
    },
    meetingEndTime: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Pre-save hook to auto-generate the meetingId
meetingSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastMeeting = await mongoose.model('Meeting').findOne().sort({ createdAt: -1 });
        // get the last job application ID and increment it by 1 if there is no job application ID then set lastMeetingID to 0 and increment it by 1
        const lastMeetingID = lastMeeting ? parseInt(lastMeeting.meetingId.split('-')[1]) : 0;
        this.meetingId = `MeetingID-${lastMeetingID + 1}`;
    }
    next();
});

module.exports = mongoose.model('Meeting', meetingSchema)