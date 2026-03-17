import React, { useState } from 'react';
import WeatherForm from './components/WeatherForm';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastDisplay from './components/ForecastDisplay';
import ErrorMessage from './components/ErrorMessage';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  return (
    <div className="app-container">
      <h1>Weather App</h1>
      <WeatherForm setWeather={setWeather} setForecast={setForecast} setError={setError} />
      {error && <ErrorMessage message={error} />}
      {weather && <WeatherDisplay weather={weather} />}
      {forecast.length > 0 && <ForecastDisplay forecast={forecast} />}
    </div>
  );
}

export default App;
