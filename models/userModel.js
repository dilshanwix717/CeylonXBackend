const mongoose = require('mongoose')
const { Schema } = mongoose

const blogPostSchema = new Schema({
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
})

module.exports = mongoose.model('BlogPost', blogPostSchema)