import React, { useState } from 'react';
import moment from 'moment';

const SampleGenerationSimulator = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [generatedData, setGeneratedData] = useState(null);

  const generateSampleData = () => {
    if (!startTime || !endTime) {
      alert('Please enter start and end time.');
      return;
    }

    const start = moment(startTime);
    const end = moment(endTime);
    
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      alert('Invalid date or time range.');
      return;
    }

    // Generate sample data for 3000 records
    const data = [];
    const millisecondsPerRecord = (end.valueOf() - start.valueOf()) / 3000;

    for (let i = 0; i < 3000; i++) {
      const ts = moment(start).add(i * millisecondsPerRecord, 'milliseconds').toISOString();
      const machine_status = Math.random() < 0.95 ? Math.floor(Math.random() * 2) : null;
      const vibration = Math.floor(Math.random() * 101) - 50;
      data.push({ ts, machine_status, vibration });
    }

    setGeneratedData(data);
  };

  // Save generated sample data as JSON file
  const saveGeneratedData = () => {
    if (!generatedData) {
      alert('No data generated yet.');
      return;
    }

    const jsonData = JSON.stringify(generatedData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-sample.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Rendering the sample generation simulator component
  return (
    <div className="container mt-5">
      <h3 className="mb-4">Sample Generation Simulator</h3>
      <div className="row mb-3">
        <div className="col">
          <label className="form-label">Start Time:</label>
          <input type="datetime-local" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="col">
          <label className="form-label">End Time:</label>
          <input type="datetime-local" className="form-control" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button className="btn btn-primary me-2" onClick={generateSampleData}>Generate Data</button>
          <button className="btn btn-success" onClick={saveGeneratedData}>Save Data</button>
        </div>
      </div>
    </div>
  );
};

export default SampleGenerationSimulator;
// End of file
// Written by Shubham Samarth
// Task assigned by Wathare Infotech Solutions
// Date: April 17, 2024