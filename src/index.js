// Importing necessary modules
const express = require('express');
const path = require('path');
const bcryptjs = require('bcryptjs');
const collection = require("./config"); // Importing mongoose model from ./config
const port = 5000;

// Creating an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Setting view engine to EJS
app.set('view engine', 'ejs');

// Serving static files from 'public' directory
app.use(express.static("public"));

// Route to render login page
app.get('/', (req, res) => {
    res.render('login');
});

// Route to render signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Handling POST request for signup
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    // Check if the username already exists
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        return res.render("user_exists"); // Render user_exists page if username already exists
    } else {
        // Hash the password before saving to database
        const saltRounds = 10;
        const hashedPassword = await bcryptjs.hash(data.password, saltRounds);
        data.password = hashedPassword;

        // Inserting new user data into the database
        try {
            const userData = await collection.insertMany(data);
            console.log(userData);
            res.render("signup_success"); // Render signup_success page upon successful signup
        } catch (error) {
            console.error(error);
            res.render("error"); // Render error page if there's an issue with database insertion
        }
    }
});

// Handling POST request for login
app.post('/login', async (req, res) => {
    try {
        // Check if the username exists
        const user = await collection.findOne({ name: req.body.username });
        
        if (!user) {
            return res.send("User not found"); // Send message if user does not exist
        }
        
        // Compare passwords
        const passwordMatch = await bcryptjs.compare(req.body.password, user.password);
        
        if (passwordMatch) {
            res.render("home"); // Render home page upon successful login
        } else {
            res.send("Wrong password"); // Send message if password does not match
        }
    } catch (error) {
        console.error(error);
        res.render("wrong_input"); // Render wrong_input page if there's an error during login
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
