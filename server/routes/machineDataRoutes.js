const express = require('express');
const router = express.Router();
const axios = require('axios'); 
const MachineData = require('../models/MachineData');

// GET all machine data
router.get('/machine-data', async (req, res) => {
  try {
    const machineData = await MachineData.find();
    res.json(machineData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new machine data
// router.post('/machine-data', async (req, res) => {
//   const machineData = new MachineData({
//     ts: req.body.ts,
//     machine_status: req.body.machine_status,
//     vibration: req.body.vibration,
//   });

//   try {
//     const newMachineData = await machineData.save();
//     res.status(201).json(newMachineData);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// GET filtered machine data by time range
router.get('/filtered-machine-data', async (req, res) => {
  const startTime = req.query.startTime;
  const duration = req.query.duration;

  if (!startTime || !duration) {
    return res.status(400).json({ message: "Both 'startTime' and 'duration' are required query parameters." });
  }

  try {
    // Fetch all machine data
    const response = await axios.get('http://localhost:5000/api/machine-data');
    const allMachineData = response.data;

    // Filter machine data based on the provided time range
    const endTime = new Date(new Date(startTime).getTime() + duration * 3600000);
    const filteredMachineData = allMachineData.filter(data => new Date(data.ts) >= new Date(startTime) && new Date(data.ts) < endTime);

    res.json(filteredMachineData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
// End of file
// Written by Shubham Samarth
// Task assigned by Wathare Infotech Solutions
// Date: April 17, 2024