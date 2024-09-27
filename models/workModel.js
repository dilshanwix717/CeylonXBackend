const mongoose = require('mongoose');
const { Schema } = mongoose

const workSchema = new Schema({
    WorkId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    keywords: {
        type: [String],
        required: true,
    },
    thumbnailImage: {
        type: Buffer,
        required: true,
    },
    mainImage: {
        type: Buffer,
        required: true,
    },
    otherImage: {
        type: Buffer,
        required: true,
    },
    brief: {
        type: String,
        required: true,
    },
    timelineImage: {
        type: Buffer,
        required: true,
    },
    colorImage: {
        type: Buffer,
        required: true,
    },
    headingFontImage: {
        type: Buffer,
        required: true,
    },
    bodyFontImage: {
        type: Buffer,
        required: true,
    },
    buttonFontImage: {
        type: Buffer,
        required: true,
    },
    challenges: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    designs: [{
        designName: {
            type: String,
            required: true,
        },
        designImage: {
            type: Buffer,
            required: true,
        },
    }],
    frontends: [{
        frontendName: {
            type: String,
            required: true,
        },
        frontendImage: {
            type: Buffer,
            required: true,
        },
    }],
    backends: [{
        backendName: {
            type: String,
            required: true,
        },
        backendImage: {
            type: Buffer,
            required: true,
        },
    }],
}, {
    timestamps: true,
});


// Pre-save hook to auto-generate the WorkId
workSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastWork = await mongoose.model('Work').findOne().sort({ createdAt: -1 });
        // get the last work ID and increment it by 1 if there is no work ID then set lastWorkID to 0 and increment it by 1
        const lastWorkID = lastWork ? parseInt(lastWork.WorkId.split('-')[1]) : 0;
        this.WorkId = `WorkID-${lastWorkID + 1}`;
    }
    next();
});

module.exports = mongoose.model('Work', workSchema);