const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);
const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Database connection successfully');
});
connection.on('error', () => {
    console.log('database connection failed');
});

module.exports = mongoose;