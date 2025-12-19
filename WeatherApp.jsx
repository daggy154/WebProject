import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// 1. THE STYLES (Responsive CSS)
const cssStyles = `
  .modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    width: 100%;
    max-width: 450px; /* Limits size on desktop */
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    animation: fadeIn 0.3s ease-out;
  }

  .weather-emoji { font-size: 5rem; margin: 10px 0; }
  .temp { font-size: 3rem; font-weight: bold; color: #333; }
  .city-name { font-size: 1.5rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
  .desc { font-style: italic; color: #888; margin-bottom: 20px; }
  
  .details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-top: 1px solid #eee;
    padding-top: 15px;
    margin-bottom: 20px;
  }

  button.close-btn {
    background: #ff5e5e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Responsive Adjustments for Mobile */
  @media (max-width: 480px) {
    .modal-content { padding: 1.5rem; }
    .temp { font-size: 2.2rem; }
    .weather-emoji { font-size: 4rem; }
  }
`;

// 2. HELPER TO MAP WEATHER TO EMOJIS
const getEmoji = (desc) => {
  const d = desc.toLowerCase();
  if (d.includes('cloud')) return '☁️';
  if (d.includes('rain')) return '🌧️';
  if (d.includes('clear')) return '☀️';
  if (d.includes('snow')) return '❄️';
  if (d.includes('thunder')) return '⛈️';
  return '🌈';
};

// 3. THE MODAL COMPONENT
const WeatherModal = ({ isOpen, onClose, data, unitLabel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <style>{cssStyles}</style>
      <div className="modal-content">
        <div className="city-name">{data.name}</div>
        <div className="weather-emoji">{getEmoji(data.weather[0].description)}</div>
        <div className="temp">{Math.round(data.main.temp)}°{unitLabel}</div>
        <p className="desc">{data.weather[0].description}</p>
        
        <div className="details-grid">
          <div>
            <strong>Humidity</strong>
            <p>{data.main.humidity}%</p>
          </div>
          <div>
            <strong>Wind</strong>
            <p>{data.wind.speed} {unitLabel === 'C' ? 'm/s' : 'mph'}</p>
          </div>
        </div>

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};

// 4. MAIN APP
export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [unit, setUnit] = useState('metric');
  const [weatherData, setWeatherData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchWeather = async (e) => {
    e.preventDefault();
    const API_KEY = 'c7f0933dd7fed678c6073cd3f2c1862f'; 
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${API_KEY}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.cod === 200) {
        setWeatherData(data);
        setIsModalOpen(true);
      } else {
        alert("City not found!");
      }
    } catch (err) {
      alert("Error connecting to weather service.");
    }
  };

  const getUnitLabel = () => {
    if (unit === 'metric') return 'C';
    if (unit === 'imperial') return 'F';
    return 'K';
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '50px 20px' }}>
      <h1>Weather Search</h1>
      <form onSubmit={fetchWeather} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px', margin: '0 auto' }}>
        <input 
          type="text" 
          placeholder="Enter City Name..." 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '10px' }}>
          <option value="metric">Celsius (°C)</option>
          <option value="imperial">Fahrenheit (°F)</option>
          <option value="standard">Kelvin (K)</option>
        </select>
        <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Check Weather
        </button>
      </form>

      {weatherData && (
        <WeatherModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          data={weatherData}
          unitLabel={getUnitLabel()}
        />
      )}
    </div>
  );
}