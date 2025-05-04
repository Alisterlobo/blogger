require("dotenv").config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')


const Blog = require('./models/blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');


const {
    checkForAuthenticationCookie,
  } = require("./middleware/authentication");

  
// console.log("Myname",process.env.myname)
const app = express();
const  PORT = process.env.PORT || 8000;

// $env:MONGO_URL = "mongodb://127.0.0.1:27017/blogy"
mongoose
   .connect(process.env.MONGO_URL)
   .then(e => console.log('MongoDB Connected'))

app.set('view engine', 'ejs')
app.set('views',path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.get('/', async (req,res) => {
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.listen(PORT, () => {
    console.log(`Server Started at PORT:${PORT}`);
})


// mongodb+srv://alisterlobo9483:q0PVQcClHQZoko71@blogcluster.ajv8fg2.mongodb.net/?retryWrites=true&w=majority&appName=blogCluster