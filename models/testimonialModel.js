const mongoose = require('mongoose');
const { Schema } = mongoose

const testimonialSchema = new Schema({
    // Testimonial Post ID (auto-generated)
    TestimonialId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: Buffer,
        required: true,
    },
}, {
    timestamps: true
});

// Pre-save hook to auto-generate the TestimonialId
testimonialSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastTestimonial = await mongoose.model('Testimonial').findOne().sort({ createdAt: -1 });
        // get the last testimonial ID and increment it by 1 if there is no testimonial ID then set lastTestimonialID to 0 and increment it by 1
        const lastTestimonialID = lastTestimonial ? parseInt(lastTestimonial.TestimonialId.split('-')[1]) : 0;
        this.TestimonialId = `TestimonialID-${lastTestimonialID + 1}`;
    }
    next();
});

module.exports = mongoose.model('Testimonial', testimonialSchema);