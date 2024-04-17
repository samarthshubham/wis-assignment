const mongoose = require('mongoose');

// Defining the schema for machine data
const machineDataSchema = new mongoose.Schema({
  ts: {
    type: Date,
    required: true,
  },
  machine_status: {
    type: Number,
    required: true,
  },
  vibration: {
    type: Number,
    required: true,
  },
}, { collection: 'machinedata' }); // Specify the collection name explicitly

// Creating a model for machine data
const MachineData = mongoose.model('MachineData', machineDataSchema);

module.exports = MachineData;
// End of file
// Written by Shubham Samarth
// Task assigned by Wathare Infotech Solutions
// Date: April 17, 2024
