import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomNav from "../CustomNav";
import { userData } from "../../helpers";
import Particle from "../Particle";
import { Button } from "reactstrap";

const Home = () => {
  const { username } = userData();
  const isLoggedIn = !!username; // Check if username exists
  const [weather, setWeather] = useState(null);
  const [greeting, setGreeting] = useState("");
  const [greetingColor, setGreetingColor] = useState("");
  const [forecastDate, setForecastDate] = useState("");
  const [forecastTime, setForecastTime] = useState("");
  const [currentChanceOfRain, setCurrentChanceOfRain] = useState("");
  const [nextDayChanceOfRain, setNextDayChanceOfRain] = useState("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.weatherapi.com/v1/forecast.json?key=13f2805a967b40df9fd170556231806&q=Osaka City, Japan&days=2"
        );
        setWeather(response.data);
        setForecastDate(response.data.location.localtime.split(" ")[0]);
        setForecastTime(response.data.location.localtime.split(" ")[1]);
        setCurrentChanceOfRain(response.data.current.daily_chance_of_rain);
        setNextDayChanceOfRain(response.data.forecast.forecastday[1].day.daily_chance_of_rain);
      } catch (error) {
        console.log("Error fetching weather:", error);
      }
    };

    if (isLoggedIn) {
      fetchWeather();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const greetings = ["a Crewmate", "an Impostor"];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
    setGreetingColor(randomGreeting === "an Impostor" ? "red" : "skyblue");
  }, []);

  const getWeatherIcon = (day) => {
    if (day && day.condition) {
      return `https:${day.condition.icon}`;
    }
    return "";
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="among-us-theme">
      <CustomNav />
      <div className="home">
        <h2>
          Welcome, {username}! You are <span style={{ color: greetingColor }}>{greeting}</span>
        </h2>
        {isLoggedIn && (
          <p>
            Current Date: {getCurrentDate()} | Current Time: {getCurrentTime()}
          </p>
        )}
        {!isLoggedIn && <Button color="primary" href="/login">Login</Button>}
        {isLoggedIn && weather && (
          <div className="weather-container">
            <div className="weather-card current-weather">
              <h3>Current Weather</h3>
              <div className="weather-info">
                <div className="weather-details">
                  <p>City: {weather.location.name}</p>
                  <p>Country: {weather.location.country}</p>
                  <p>Temperature: {weather.current.temp_c}°C</p>
                  <p>Condition: {weather.current.condition.text}</p>
                  <p>Humidity: {weather.current.humidity}%</p>
                  <p>Wind Speed: {weather.current.wind_kph} km/h</p>
                  <p>Chance of Rain: {currentChanceOfRain}%</p>
                  <p>Heat Index: {weather.current.heatindex_c}°C</p>
                  <p>Forecast Date: {forecastDate}</p>
                  <p>Forecast Time: {forecastTime}</p>
                </div>
                <div className="weather-icon">
                  <img src={getWeatherIcon(weather.current)} alt="Weather Icon" className="icon-large" />
                </div>
              </div>
            </div>
            <div className="weather-card next-day-weather">
              <h3>Next Day Forecast</h3>
              <div className="weather-info">
                <div className="weather-next-details">
                  <p>City: {weather.location.name}</p>
                  <p>Country: {weather.location.country}</p>
                  <p>Temperature: {weather.forecast.forecastday[1].day.avgtemp_c}°C</p>
                  <p>Condition: {weather.forecast.forecastday[1].day.condition.text}</p>
                  <p>Humidity: {weather.forecast.forecastday[1].day.avghumidity}%</p>
                  <p>Chance of Rain: {nextDayChanceOfRain}%</p>
                  <p>Forecast Date: {forecastDate}</p>
                  <p>Forecast Time: {forecastTime}</p>
                </div>
                <div className="weather-next-icon">
                  <img
                    src={getWeatherIcon(weather.forecast.forecastday[1].day)}
                    alt="Weather Icon"
                    className="icon-next-large"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Particle />
    </div>
  );
};

export default Home;
