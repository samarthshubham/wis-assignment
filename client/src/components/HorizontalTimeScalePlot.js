import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const HorizontalTimeScalePlot = () => {
  const [machineData, setMachineData] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  useEffect(() => {
    generateSummary(); // Generate summary when machine data changes
  }, [machineData]);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/machine-data');
      const data = await response.json();
      setMachineData(data);
      
      // Update start and end times based on fetched data
      if (data.length > 0) {
        const startTime = new Date(data[0].ts);
        const endTime = new Date(data[data.length - 1].ts);
        setStartTime(startTime);
        setEndTime(endTime);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getColor = (status) => {
    return status === 0 ? 'yellow' : (status === 1 ? 'green' : 'red'); // Determine color based on machine status
  };

  const renderMachineStatus = () => {
    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <div className="row mt-4">
              <div className="col">
                <div className="d-flex justify-content-end">
                  <button className="btn btn-light" onClick={() => handleButtonClick(1)}>1 hr</button>
                  <button className="btn btn-primary ml-2" onClick={() => handleButtonClick(8)}>8 hrs</button>
                  <button className="btn btn-dark ml-2" onClick={() => handleButtonClick(24)}>24 hrs</button>
                </div>
              </div>
            </div>
            <h5>Cycle Status</h5>
            <div className="d-flex justify-content-between align-items-stretch mt-2">
              {machineData.map((data, index) => (
                <div key={index} style={{ width: '3%', backgroundColor: getColor(data.machine_status), borderRadius: '50%', height: '1cm' }} />
              ))}
            </div>
            <div className="row mt-2">
              <div className="col">
                {renderTimeScale()}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <h6>Summary</h6>
            {summary && renderSummaryTable()}
          </div>
        </div>
      </div>
    );
  };

  const renderTimeScale = () => {
    if (!startTime || !endTime) {
      return null; 
    }

    const intervals = [];
    let currentTime = new Date(startTime); 

    while (currentTime <= endTime) {
      intervals.push(new Date(currentTime)); 
      currentTime.setTime(currentTime.getTime() + 10 * 60 * 1000); 
    }

    return (
      <div className="d-flex justify-content-between">
        {intervals.map((time, index) => (
          <div key={index} className="text-center">
            <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSummaryTable = () => {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Number of 1s</th>
            <th>Number of 0s</th>
            <th>Continuous 0s (Highest)</th>
            <th>Continuous 1s (Highest)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{summary.numberOfOnes}</td>
            <td>{summary.numberOfZeros}</td>
            <td>{summary.longestConsecutiveZeros}</td>
            <td>{summary.longestConsecutiveOnes}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  const handleButtonClick = async (duration) => {
    const inputTimestamp = prompt('Please enter a timestamp (YYYY-MM-DDTHH:MM:SSZ)', '2024-01-21T15:00:00Z');
    if (!inputTimestamp) return; 

    try {
      const response = await fetch(`http://localhost:5000/api/filtered-machine-data?startTime=${inputTimestamp}&duration=${duration}`);
      const data = await response.json();
      setMachineData(data);

      
      if (data.length > 0) {
        const startTime = new Date(data[0].ts);
        const endTime = new Date(data[data.length - 1].ts);
        setStartTime(startTime);
        setEndTime(endTime);
      }
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  const generateSummary = () => {
    if (machineData.length === 0) {
      setSummary(null);
      return;
    }

    // Calculate summary data
    let numberOfOnes = 0;
    let numberOfZeros = 0;
    let longestConsecutiveZeros = 0;
    let longestConsecutiveOnes = 0;
    let currentConsecutiveZeros = 0;
    let currentConsecutiveOnes = 0;

    for (let i = 0; i < machineData.length; i++) {
      const status = machineData[i].machine_status;
      if (status === 0) {
        numberOfZeros++;
        currentConsecutiveZeros++;
        longestConsecutiveOnes = Math.max(longestConsecutiveOnes, currentConsecutiveOnes);
        currentConsecutiveOnes = 0;
      } else if (status === 1) {
        numberOfOnes++;
        currentConsecutiveOnes++;
        longestConsecutiveZeros = Math.max(longestConsecutiveZeros, currentConsecutiveZeros);
        currentConsecutiveZeros = 0;
      }
    }

    longestConsecutiveZeros = Math.max(longestConsecutiveZeros, currentConsecutiveZeros);
    longestConsecutiveOnes = Math.max(longestConsecutiveOnes, currentConsecutiveOnes);

    setSummary({
      numberOfOnes,
      numberOfZeros,
      longestConsecutiveZeros,
      longestConsecutiveOnes,
    });
  };

  return (
    <div>
      {renderMachineStatus()}
    </div>
  );
};

export default HorizontalTimeScalePlot;
// End of file
// Written by Shubham Samarth
// Task assigned by Wathare Infotech Solutions
// Date: April 17, 2024