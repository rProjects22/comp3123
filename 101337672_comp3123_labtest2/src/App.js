import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import { BsSun, BsCloudFog, BsCloud, BsCloudHaze } from 'react-icons/bs';
import './App.css';

const ApiKey = '94893f11b04c9d2bb56e1e014bc71f94';
const suggestedLocations = ['New York', 'Tokyo', 'Paris', 'Sydney'];

const WeatherIcon = ({ iconCode }) => {
  const iconMap = {
    '01d': <BsSun />,
    '01n': <BsSun />,
    '02d': <BsCloud />,
    '02n': <BsCloud />,
    '03d': <BsCloud />,
    '03n': <BsCloud />,
    '04d': <BsCloudHaze />,
    '04n': <BsCloudHaze />,
    '09d': <BsCloudHaze />,
    '09n': <BsCloudHaze />,
    '10d': <BsCloudHaze />,
    '10n': <BsCloudHaze />,
    '11d': <BsCloudHaze />,
    '11n': <BsCloudHaze />,
    '13d': <BsCloudFog />,
    '13n': <BsCloudFog />,
    '50d': <BsCloudFog />,
    '50n': <BsCloudFog />,
  };

  return <div className="icon">{iconMap[iconCode] || null}</div>;
};

const WeatherDetails = ({ weatherData }) => {
  return (
    <div className="weather-details">
      {weatherData.weather.map((condition) => (
        <div className="detail" key={condition.id}>
          <WeatherIcon iconCode={condition.icon} />
          <p>{condition.description}</p>
        </div>
      ))}
      <div className="detail">
        <WeatherIcon iconCode="50d" />
        <p>Mist</p>
      </div>
      <div className="detail">
        <WeatherIcon iconCode="02d" />
        <p>Cloudy: {weatherData.clouds.all}%</p>
      </div>
      <div className="detail">
        <WeatherIcon iconCode="50d" />
        <p>Humidity: {Math.round(weatherData.main.humidity)}%</p>
      </div>
      <div className="detail">
        <WeatherIcon iconCode="50d" />
        <p>Wind: {Math.round(weatherData.wind.speed)} km/h</p>
      </div>
      <div className="detail">
        <WeatherIcon iconCode="50d" />
        <p>Pressure: {weatherData.main.pressure} hPa</p>
      </div>
    </div>
  );
};

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [searchText, setSearchText] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const getDefaultCityData = async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=New York&units=metric&appid=${ApiKey}`
        );

        const data = response.data;
        setWeatherData(data);

        const d = new Date();
        const dateString =
          ('0' + d.getDate()).slice(-2) +
          '-' +
          ('0' + (d.getMonth() + 1)).slice(-2) +
          '-' +
          d.getFullYear() +
          ' ' +
          ('0' + d.getHours()).slice(-2) +
          ':' +
          ('0' + d.getMinutes()).slice(-2);

        setCurrentDate(dateString);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error fetching default city weather data:', error);
        setIsLoaded(true);
      }
    };

    getDefaultCityData();
  }, []);

  useEffect(() => {
    const filteredSuggestions = suggestedLocations.filter((location) =>
      location.toLowerCase().includes(searchText.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  }, [searchText]);

  const handleSuggestionClick = async (suggestion) => {
    setSearchText(suggestion);
    setIsLoaded(false);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${suggestion}&units=metric&appid=${ApiKey}`
      );

      const data = response.data;
      setWeatherData(data);

      const d = new Date();
      const dateString =
        ('0' + d.getDate()).slice(-2) +
        '-' +
        ('0' + (d.getMonth() + 1)).slice(-2) +
        '-' +
        d.getFullYear() +
        ' ' +
        ('0' + d.getHours()).slice(-2) +
        ':' +
        ('0' + d.getMinutes()).slice(-2);

      setCurrentDate(dateString);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setIsLoaded(true);
    }
  };

  return (
    <div className="app-container">
      {isLoaded ? (
        <div className="weather-container">
          <div className="left-container">
            <WeatherIcon iconCode={weatherData.weather && weatherData.weather.length > 0 ? weatherData.weather[0].icon : '01d'} />
            <div className="temperature">{Math.round(weatherData.main.temp)}°</div>
          </div>
          <div className="right-container">
            <div className="location">
              <h2>{weatherData.name || 'New York'}</h2>
              <small>{currentDate}</small>
            </div>
            <WeatherDetails weatherData={weatherData} />
            <div className="search">
              <input
                type="text"
                name="location"
                placeholder="Search location"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="search-button" onClick={() => handleSuggestionClick(searchText)}>
                Search
              </button>
            </div>
            <div className="suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Spinner animation="grow" variant="primary" />
      )}
    </div>
  );
}

export default App;


