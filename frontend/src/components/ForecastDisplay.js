import React from "react";

function ForecastDisplay({ forecast }) {
  if (!forecast || forecast.length === 0) return null;
  return (
    <div className="forecast-display">
      <h2>5-Day Forecast</h2>
      <div className="forecast-list">
        {forecast.slice(0, 5).map((item, idx) => (
          <div key={item.dt_txt || idx} className="forecast-item">
            <div>{item.dt_txt ? item.dt_txt.slice(0, 10) : ""}</div>
            <div>
              <strong>{item.weather[0].main}</strong>
            </div>
            <div>Temp: {item.main.temp}°C</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt="icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastDisplay;
