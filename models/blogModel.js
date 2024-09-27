const mongoose = require('mongoose');
const { Schema } = mongoose

const blogSchema = new Schema({
    // Blog Post ID (auto-generated)
    BlogId: {
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
    // Web , Mobile, ERP, IOT
    category: {
        type: String,
        required: true,
    },
    subHeading: {
        type: String,
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
    body: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// Pre-save hook to auto-generate the BlogId
blogSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastBlog = await mongoose.model('Blog').findOne().sort({ createdAt: -1 });
        // get the last blog ID and increment it by 1 if there is no blog ID then set lastBlogID to 0 and increment it by 1
        const lastBlogID = lastBlog ? parseInt(lastBlog.BlogId.split('-')[1]) : 0;
        this.BlogId = `BlogID-${lastBlogID + 1}`;
    }
    next();
});

module.exports = mongoose.model('Blog', blogSchema);