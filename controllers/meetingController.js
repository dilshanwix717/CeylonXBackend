const Meeting = require('../models/meetingModel')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Add a meeting post
const scheduleMeeting = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const meetingDate = req.body.meetingDate;
        const meetingStartTime = req.body.meetingStartTime;
        const meetingEndTime = req.body.meetingEndTime;

        const meeting = await Meeting.findOne({ meetingId: meetingId });

        if (!meeting) {
            return res.json({
                error: 'Meeting not found'
            });
        }

        meeting.meetingScheduled = true;
        meeting.meetingDate = meetingDate;
        meeting.meetingStartTime = meetingStartTime;
        meeting.meetingEndTime = meetingEndTime;

        const updatedMeeting = await meeting.save();

        return res.json(updatedMeeting);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while scheduling meeting'
        });
    }
};

// Get all meeting posts
const getAllMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find().sort({ createdAt: -1 });

        return res.json(meetings);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching meeting posts'
        });
    }
};

// Get a meeting post by MeetingId
const getMeetingById = async (req, res) => {
    try {
        const meetingId = req.params.id;
        const meeting = await Meeting.findOne({ meetingId: meetingId });

        if (!meeting) {
            return res.json({
                error: 'Meeting not found'
            });
        }
        return res.json(meeting);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching meeting post'
        });
    }
};


module.exports = { addMeeting, getAllMeetings, getMeetingById, updateCheckedStatus, getCategoryCounts, scheduleMeeting };