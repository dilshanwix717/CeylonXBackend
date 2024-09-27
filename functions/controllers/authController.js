const jwt = require('jsonwebtoken')//allows to implement cookies for specific users and track them through out the web site

const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/authHelp')

const test = (req, res) => {
    res.json('test is working')
}
//to use the information
//Register user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //check if name was entered
        if (!name) res.json({
            error: 'Please enter your name and try again'
        })
        // Check if email is valid (using a regex pattern)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            return res.json({
                error: 'Please enter a valid email address and try again'
            });
        }
        //check if password is good
        if (!password || password.length < 6) {
            return res.json({
                error: 'Please enter a password that is at least 6 characters and try again'
            })
        }

        // Check for duplicate email (case-insensitive)
        const existingEmail = await User.findOne({ email: req.body.email.toLowerCase() });
        if (existingEmail) {
            return res.json({
                error: 'This email already taken. Please try a different one'
            });
        }

        //hashing the password
        const hashedPassword = await hashPassword(password)

        //create a user in database
        const newUser = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
        })
        const savedUser = await newUser.save();

        // const savedUser = await User.create({
        //     name,email,password
        // });

        return res.json(savedUser);
    } catch (error) {
        console.log(error)
    }
}


//Login user
//Login user
const login = async (req, res) => {
    try {
        //get the email and password from the request body  (req.body)  from the client side request
        const { email, password } = req.body;
        //check if email was entered
        if (!email) return res.json({ error: 'Please enter a valid email and try again' })
        //check if password is good
        if (!password || password.length < 6) return res.json({ error: 'Please enter a password that is at least 6 characters and try again' })

        //check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.json({ error: 'User not found!. Please Register first' })

        //compare password using bcrypt
        const isMatch = await comparePassword(password, user.password);
        if (isMatch) {

            jwt.sign({ email: user.email, id: user._id, name: user.name }, process.env.JWT_SECRET, {}, (err, token) => {
                if (err) throw err;
                res.cookie('userData', token).json(user); // Set the cookie with the correct key
            });
        }
        if (!isMatch) {
            res.json({ error: 'Invalid Password!. Please try again' })
        }

    } catch (error) {
        console.log(error)
    }
}

// profile function
const profile = async (req, res) => {
    const token = req.cookies.userData; // Get the token from the cookie
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
            if (err) {
                console.log("JWT verification error:", err);
                return res.json({ error: 'Token is not valid' });
            }
            console.log("User retrieved:", user); // Check if the user data is correct
            res.json(user);
        });
    } else {
        console.log("No token found.");
        res.json(null);
    }
};

const logout = async (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    test,
    register,
    login,
    profile,
    logout
}