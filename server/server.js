const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/wisdb'); 

const db = mongoose.connection;
// Handling MongoDB connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Using machineDataRoutes for API handling
app.use('/api', require('./routes/machineDataRoutes'));
// End of file
// Written by Shubham Samarth
// Task assigned by Wathare Infotech Solutions
// Date: April 17, 2024