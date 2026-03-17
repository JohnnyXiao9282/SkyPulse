import React from 'react';

function WeatherDisplay({ weather }) {
  if (!weather) return null;
  return (
    <div className="weather-display">
      <h2>Current Weather</h2>
      <div>
        <strong>{weather.weather[0].main}</strong> - {weather.weather[0].description}
      </div>
      <div>Temperature: {weather.main.temp}°C</div>
      <div>Humidity: {weather.main.humidity}%</div>
      <div>Wind: {weather.wind.speed} m/s</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="icon" />
    </div>
  );
}

export default WeatherDisplay;
