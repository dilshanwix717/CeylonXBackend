const mongoose = require('mongoose');
const { Schema } = mongoose;

const workCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures each category name is unique
    },
    workCount: {
        type: Number,
        default: 0, // Initializes the work count to 0
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('WorkCategory', workCategorySchema)
