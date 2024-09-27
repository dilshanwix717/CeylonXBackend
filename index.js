const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors')
const { mongoose } = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express();
dotenv.config();

//database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Database connected'))
    .catch((err) => console.log('Database in not connected!', err))

//middleware- to handle the data
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
// const corsOptions = {
//     origin: 'http://localhost:3000', // Your frontend URL
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
// };
// app.use(cors(corsOptions));


app.use('/', require('./routes/authRoutes'))
app.use('/', require('./routes/careerRoutes'))
app.use('/', require('./routes/blogRoutes'))
app.use('/', require('./routes/workRoutes'))
app.use('/', require('./routes/testimonialRoutes'))
app.use('/', require('./routes/projectRequestRoutes'))

const port = 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`))