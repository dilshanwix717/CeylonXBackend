const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures each category name is unique
    },
    blogCount: {
        type: Number,
        default: 0, // Initializes the blog count to 0
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('BlogCategory', blogCategorySchema)
