import React, { useState } from 'react';
import axios from 'axios';

function WeatherForm({ setWeather, setForecast, setError }) {
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWeather(null);
    setForecast([]);
    try {
      // Fetch current weather
      const res = await axios.post('/api/weather', {
        location,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      });
      setWeather(res.data.weatherData[0] || res.data.weatherData);
      // Fetch 5-day forecast
      const forecastRes = await axios.post('/api/weather', {
        location,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      });
      setForecast(forecastRes.data.weatherData);
    } catch (err) {
      setError('Could not fetch weather. Please check the location or try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="weather-form">
      <input
        type="text"
        placeholder="Enter city, zip, or landmark"
        value={location}
        onChange={e => setLocation(e.target.value)}
        required
      />
      <button type="submit">Get Weather</button>
    </form>
  );
}

export default WeatherForm;
