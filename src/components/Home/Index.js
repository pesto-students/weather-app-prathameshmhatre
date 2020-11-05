import React, { useState, useEffect } from 'react';
import apiCall from '../../helper/index';
import GooglePlaceAutoComplete from '../GooglePlaceAutoComplete/Index';
import logo from './images/Havaman.png';
import './css/style.css';

const { REACT_APP_OPEN_WEATHER_API_KEY } = process.env;
const Home = () => {
  const [place, setPlace] = useState({});
  const [weather, setWeather] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const getDateTime = () => {
    if ('timezone' in weather) {
      const currentMonth = new Date().toLocaleString('en-US', {
        timeZone: weather.timezone,
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      return currentMonth;
    }
    return '';
  };

  const getHumidity = () => {
    if ('current' in weather) {
      return `Humidity: ${weather.current.humidity}%`;
    }
    return '';
  };

  const getCurrentTemperature = () => {
    if ('current' in weather) {
      return <>{Math.round(weather.current.temp)}&deg;C</>;
    }
    return '';
  };

  const getWindSpeed = () => {
    if ('current' in weather) {
      return `Wind : ${weather.current.wind_speed}m/s`;
    }
    return '';
  };

  const getPlaceInfo = () => {
    if ('lat' in place) {
      const { sublocality_level_1: name, country } = place;
      return (
        <b>
          {name}, {country}
        </b>
      );
    }
    return '';
  };

  const getAtmosphericPressure = () => {
    if ('current' in weather) {
      return `Pressure : ${weather.current.pressure}hPa`;
    }
    return '';
  };

  const getFeelsLikeInfo = () => {
    if ('current' in weather) {
      return <>Feels like {Math.round(weather.current.feels_like)}&deg;C</>;
    }
    return '';
  };

  const fetchWeather = async () => {
    const { lat, lon } = place;
    try {
      const urlParameter = {
        lat,
        lon,
        exclude: '{minutely}',
        units: 'metric',
        appid: REACT_APP_OPEN_WEATHER_API_KEY,
      };
      const result = await apiCall(
        'https://api.openweathermap.org/data/2.5/onecall',
        'get',
        urlParameter
      );

      setWeather({ ...result });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onPlaceSelect = (selectedPlace) => {
    setPlace({
      ...selectedPlace,
    });
  };

  useEffect(() => {
    if ('lat' in place) {
      setIsLoading(true);
      fetchWeather();
    }
  }, [place]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-center">
        <div className="main-container">
          <div className="logo text-center">
            <img src={logo} alt="How's the weather" />
          </div>
          <div className="search-container">
            <GooglePlaceAutoComplete onPlaceSelect={onPlaceSelect} />
          </div>
          <div className="place-weather-details">
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="row">
                  <div className="col">
                    <div className="date-time-container">{getDateTime()}</div>
                    <div className="temperature-container">{getCurrentTemperature()}</div>
                  </div>
                  <div className="col">
                    <div className="location-container">{getPlaceInfo()}</div>
                    <div className="wind-speed-container">{getWindSpeed()}</div>
                    <div className="atmospheric-pressure-container">{getAtmosphericPressure()}</div>
                    <div className="humidity-container">{getHumidity()}</div>
                  </div>
                </div>
                <div className="feels-like">{getFeelsLikeInfo()}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
