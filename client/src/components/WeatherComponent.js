import React, { useState } from 'react';

const WeatherComponent = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState('C');

  const API_KEY = 'W3oGXNQaexZdweYzMlQJ2oqggCCYynXf'; // external API key

  const handleSearch = async () => {
    if (!city) {
      alert('Please enter a city name.');
      return;
    }

    try {
      const locationResponse = await fetch(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`); // Fetch location data using external API
      const locationData = await locationResponse.json();
      if (locationData && locationData.length > 0) {
        const key = locationData[0].Key;
        const weatherResponse = await fetch(`http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${key}?apikey=${API_KEY}`); // Fetch weather data based on location key
        const weatherData = await weatherResponse.json();
        setWeather(weatherData); // Set weather state with fetched data
      } else {
        alert('City not found.');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      alert('An error occurred while fetching weather data.');
    }
  };

  const handleUnitChange = () => {
    setUnit(unit === 'C' ? 'F' : 'C');
  };

  // Rendering the WeatherComponent
  return (
    <div className="container mt-5">
      <h3 className="mb-4">Weather Information</h3>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
      </div>
      {weather && (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{city}</h5>
            <div className="row">
              <div className="col">
                <p className="card-text">Temperature: {unit === 'C' ? weather[0].Temperature.Value + '°C' : ((weather[0].Temperature.Value * 9/5) + 32).toFixed(2) + '°F'}</p>
                <button className="btn btn-secondary" onClick={handleUnitChange}>Toggle Unit</button>
              </div>
              <div className="col">
                <p className="card-text">Weather: {weather[0].IconPhrase}</p>
                <p className="card-text">Precipitation Probability: {weather[0].PrecipitationProbability}%</p>
                <p className="card-text">Updated at: {new Date(weather[0].DateTime).toLocaleString()}</p>
              </div>
            </div>
            <hr />
            <div className="alert alert-warning" role="alert" style={{ padding: '0.5rem', borderRadius: '0.25rem' }}>
              Data may be inaccurate as the API is free and available for testing purposes only.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherComponent;
// End of file
// Written by Shubham Samarth
// Task assigned by Wathare Infotech Solutions
// Date: April 17, 2024