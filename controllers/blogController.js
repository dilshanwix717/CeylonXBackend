const Blog = require('../models/blogModel')
const BlogCategory = require('../models/blogCategoryModel');
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Add a blog post
const addBlogPost = async (req, res) => {
    try {
        const { name, description, category, subHeading, body } = req.body;

        // Check if all fields are filled
        if (!category || !description || !name || !subHeading || !body) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        if (!req.files) {
            return res.json({
                error: 'No files were uploaded'
            });
        }

        if (!req.files.thumbnailImage || !req.files.mainImage) {
            return res.json({
                error: 'Both thumbnail and main images are required'
            });
        }

        const thumbnailImage = req.files.thumbnailImage[0].buffer;
        const mainImage = req.files.mainImage[0].buffer;

        // Create a new blog post
        const newBlog = new Blog({
            BlogId: "BlogID-1",
            name,
            description,
            category,
            subHeading,
            thumbnailImage: thumbnailImage,
            mainImage: mainImage,
            body,
        });
        // Save the blog post to the database
        const savedBlog = await newBlog.save();

        return res.json(savedBlog);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while creating a blog post'
        });
    }
}


// Get all blog posts
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({}, {
            thumbnailImage: 0,
            mainImage: 0,
        }).sort({ createdAt: -1 });

        // Convert the buffers to Base64 strings
        const formattedBlogs = blogs.map(blog => ({
            _id: blog._id,
            BlogId: blog.BlogId,
            name: blog.name,
            description: blog.description,
            category: blog.category,
        }));
        return res.json(formattedBlogs);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching blog posts'
        });
    }
};

// Get all work thumbnail images
const getAllThumbnailBlogImages = async (req, res) => {
    try {
        // Select only the thumbnailImage, _id, and BlogId fields
        const thumbnailImages = await Blog.find({}, {
            thumbnailImage: 1,
            _id: 1,
            BlogId: 1
        });
        // Convert the thumbnailImage buffers to Base64 strings
        const formattedThumbnailImages = thumbnailImages.map(image => ({
            _id: image._id,
            BlogId: image.BlogId,
            thumbnailImage: image.thumbnailImage.toString('base64')
        }));
        return res.json(formattedThumbnailImages);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching thumbnail images'
        });
    }
};

// Get a blog post by BlogId
const getBlogById = async (req, res) => {
    try {
        const BlogId = req.params.id;

        const blog = await Blog.findOne({ BlogId: BlogId });

        if (!blog) {
            return res.json({
                error: 'Blog not found'
            });
        }
        // Convert the buffers to Base64 strings
        const formattedBlog = {
            ...blog._doc,
            thumbnailImage: blog.thumbnailImage.toString('base64'),
            mainImage: blog.mainImage.toString('base64')
        };
        return res.json(formattedBlog);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching blog post'
        });
    }
};


const getBlogTextById = async (req, res) => {
    try {
        const BlogId = req.params.id;
        // Exclude the image fields by passing them as 0 in the select method
        const blog = await Blog.findOne(
            { BlogId: BlogId },
            {
                thumbnailImage: 0,
                mainImage: 0,
            }
        );

        if (!blog) {
            return res.status(404).json({
                error: 'Blog not found'
            });
        }

        // Map through the result to include designName, frontendName, and backendName
        const formattedBlog = {
            _id: blog._id,
            BlogId: blog.BlogId,
            name: blog.name,
            description: blog.description,
            category: blog.category,
            subHeading: blog.subHeading,
            body: blog.body,
        };
        return res.status(200).json(formattedBlog);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: 'Error occurred while fetching blog post'
        });
    }
};


// Update a blog post by BlogId
const updateBlogPost = async (req, res) => {
    try {
        const BlogId = req.params.id;
        const blog = await Blog.findOne({ BlogId: BlogId });

        if (!blog) {
            return res.json({
                error: 'Blog not found'
            });
        }

        const { name, description, category, subHeading, body } = req.body;

        // Check if all fields are filled
        if (!category || !description || !name || !subHeading || !body) {
            return res.json({
                error: 'Please fill all fields and try again'
            });
        }

        if (req.files) {
            if (req.files.thumbnailImage) {
                blog.thumbnailImage = req.files.thumbnailImage[0].buffer;
            }
            if (req.files.mainImage) {
                blog.mainImage = req.files.mainImage[0].buffer;
            }
        }

        blog.name = name;
        blog.description = description;
        blog.category = category;
        blog.subHeading = subHeading;
        blog.body = body;

        // Save the updated blog post to the database
        const updatedBlog = await blog.save();

        // Convert the buffers to Base64 strings
        const formattedBlog = {
            ...updatedBlog._doc,
            thumbnailImage: updatedBlog.thumbnailImage.toString('base64'),
            mainImage: updatedBlog.mainImage.toString('base64')
        };

        return res.json(formattedBlog);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while updating blog post'
        });
    }
};

// Delete a blog post by BlogId
const deleteBlogPost = async (req, res) => {
    try {
        const BlogId = req.params.id;
        const blog = await Blog.findOneAndDelete({ BlogId: BlogId });

        if (!blog) {
            return res.json({
                error: 'Blog not found'
            });
        }


        return res.json({
            message: 'Blog post deleted successfully'
        });
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while deleting blog post'
        });
    }
};


// Create a new blog category
const createBlogCategory = async (req, res) => {
    try {
        const { name } = req.body;
        // Check if all fields are filled
        if (!name) {
            return res.json({
                error: 'Please fill category name'
            });
        }
        // Create a new blog post
        const newBlogCategory = new BlogCategory({
            name,
            blogCount: 0
        });
        // Save the blog post to the database
        const savedBlogCategory = await newBlogCategory.save();
        return res.json(savedBlogCategory);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while creating a blog category'
        });
    }
};


const getBlogCategoryCounts = async (req, res) => {
    try {
        // Get all blog categories
        const blogCategories = await BlogCategory.find();

        // Map over each category and count associated blogs
        const blogCategoryCounts = await Promise.all(
            blogCategories.map(async (blogCategory) => {
                const count = await Blog.countDocuments({ category: blogCategory.name });
                return {
                    name: blogCategory.name,
                    count,
                };
            })
        );

        return res.json(blogCategoryCounts);
    } catch (error) {
        console.log(error);
        return res.json({
            error: 'Error occurred while fetching blog category counts'
        });
    }
};


module.exports = { addBlogPost, getAllBlogs, getAllThumbnailBlogImages, getBlogById, getBlogTextById, updateBlogPost, deleteBlogPost, createBlogCategory, getBlogCategoryCounts };