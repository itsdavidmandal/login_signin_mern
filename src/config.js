// Importing necessary modules
const { name } = require("ejs"); // Destructuring 'name' from 'ejs' module (not used in this snippet)
const mongoose = require("mongoose"); // Importing mongoose for MongoDB operations

// Connecting to MongoDB
const connect = mongoose.connect("mongodb://localhost:27017/Login") // Connecting to MongoDB at localhost:27017/Login

// Handling connection success and failure
connect.then(() => {
    console.log("database connected"); // Log message when database connection is successful
}).catch(() => {
    console.log("database not connected"); // Log message when database connection fails
});

// Defining the schema for the 'users' collection
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // 'name' field is required and must be a string
    },
    password: {
        type: String,
        required: true // 'password' field is required and must be a string
    }
});

// Creating a mongoose model based on the schema for the 'users' collection
const collection = new mongoose.model("users", LoginSchema);

// Exporting the mongoose model for use in other parts of the application
module.exports = collection;

