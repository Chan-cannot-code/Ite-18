import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import CustomNav from "../CustomNav";
import { userData } from "../../helpers";
import Particle from "../Particle";
import { Button } from "reactstrap";
import { FaPlay, FaPause } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Background = memo(() => {
  return <Particle />;
});

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
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "https://api.weatherapi.com/v1/forecast.json?key=13f2805a967b40df9fd170556231806&q=Butuan City, Philippines&days=2"
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
    const generateRandomGreeting = () => {
      const greetings = ["a Crewmate", "an Impostor"];
      const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
      setGreeting(randomGreeting);
      setGreetingColor(randomGreeting === "an Impostor" ? "red" : "skyblue");
  
      if (isLoggedIn) {
        if (randomGreeting === "an Impostor") {
          toast.dismiss(); // Dismiss all previous notifications
          toast.error("Sabotage the Weather System");
        } else {
          toast.dismiss(); // Dismiss all previous notifications
          toast.info("Supervise the Weather forecast");
        }
      }
    };
  
    generateRandomGreeting();

    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setCurrentDate(getCurrentDate());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
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

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="among-us-theme">
      <CustomNav />
      <div className="home">
        <div className="welcome-container">
          {isLoggedIn && (
            <h2>
              Welcome, {username}! You are <span style={{ color: greetingColor }}>{greeting}</span>
            </h2>
          )}
          {!isLoggedIn && <Button color="primary" href="/login">Login</Button>}
          <div className="music-controls">
            {isMusicPlaying ? (
              <FaPause className="music-icon" onClick={handleMusicToggle} />
            ) : (
              <FaPlay className="music-icon" onClick={handleMusicToggle} />
            )}
            {isMusicPlaying && (
              <iframe
                width="240"
                height="170"
                src="https://www.youtube.com/embed/9WX97X4MN6s"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                title="YouTube video player"
                className="youtube-iframe"
              />
            )}
          </div>
        </div>
        {isLoggedIn && (
          <p>
            Current Date: {currentDate} | Current Time: {currentTime}
          </p>
        )}
        {isLoggedIn && weather && (
          <div className="weather-container">
            <div className="weather-card current-weather">
              <h3>Current Weather</h3>
              <div className="weather-info">
                <div className="weather-icon">
                  <img src={getWeatherIcon(weather.current)} alt="Weather Icon" className="icon-large" />
                </div>
                <div className="weather-details">
                  <p>City: {weather.location.name}</p>
                  <p>Country: {weather.location.country}</p>
                  <p>Temperature: {weather.current.temp_c}°C</p>
                  <p>Condition: {weather.current.condition.text}</p>
                  <p>Humidity: {weather.current.humidity}%</p>
                  <p>Wind Speed: {weather.current.wind_kph} km/h</p>
                  <p>Forecast Date: {forecastDate}</p>
                  <p>Forecast Time: {forecastTime}</p>
                </div>
              </div>
            </div>
            <div className="weather-card next-day-weather">
              <h3>Next Day Forecast</h3>
              <div className="weather-info">
                <div className="weather-next-icon">
                  <img
                    src={getWeatherIcon(weather.forecast.forecastday[1].day)}
                    alt="Weather Icon"
                    className="icon-next-large"
                  />
                </div>
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
              </div>
            </div>
          </div>
        )}
      </div>
      <Background />
    </div>
  );
};

export default Home;
