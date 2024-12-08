import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "./LocationProvider";
const WeatherDataContext = createContext();

export function useWeatherData() {
  return useContext(WeatherDataContext);
}

export function useWeatherCondition(code, is_day) {
  let day = Boolean(is_day);
  const weatherCode = {
    0: "Clear",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Fog",
    51: "Light Drizzle",
    53: "Medium Drizzle",
    55: "Dense Drizzle",
    56: "Light frosty Drizzle",
    57: "Dense frosty Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    66: "Light frosty Rain",
    67: "heavy frosty Rain",
    71: "Slight Snow Fall",
    73: "moderate Snow Fall",
    75: "heavy Snow Fall",
    77: "Snow Grains",
    80: "Slight Rain Showers",
    81: "Moderate Rain Showers",
    82: "Violent Rain Showers",
    85: "slight Snow Showers",
    86: "heavy Snow Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Slight Hail",
    99: "Thunderstorm with Medium Hail",
  };

  const weatherIcon = {
    0: day ? "0.png" : "0_1.png",
    1: day ? "1.png" : "1_1.png",
    2: day ? "1.png" : "1_1.png",
    3: day ? "1.png" : "1_1.png",
    45: day ? "45.png" : "45_1.png",
    48: day ? "45.png" : "45_1.png",
    51: day ? "51.png" : "51_1.png",
    53: day ? "51.png" : "51_1.png",
    55: day ? "51.png" : "51_1.png",
    56: day ? "56.png" : "56_1.png",
    57: day ? "56.png" : "56_1.png",
    61: day ? "61.png" : "61_1.png",
    63: day ? "63.png" : "63.png",
    65: day ? "63.png" : "63.png",
    66: day ? "66.png" : "66_1.png",
    67: day ? "66.png" : "66_1.png",
    71: day ? "56.png" : "56_1.png",
    73: day ? "66.png" : "66_1.png",
    75: day ? "66.png" : "66_1.png",
    77: day ? "77.png" : "77_1.png",
    80: day ? "61.png" : "61_1.png",
    81: day ? "61.png" : "61_1.png",
    82: day ? "63.png" : "63.png",
    85: day ? "56.png" : "56_1.png",
    86: day ? "66.png" : "66_1.png",
    95: day ? "95.png" : "95_1.png",
    96: day ? "96.png" : "96.png",
    99: day ? "96.png" : "96.png",
  };

  const condition = weatherCode[code];
  const icon = weatherIcon[code];
  return { condition, icon };
}

export default function WeatherDataProvider({ children }) {
  const [weatherData, setWeatherData] = useState();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [weatherUnit, setWeatherUnit] = useState(
    localStorage.getItem("weatherunit")
      ? localStorage.getItem("weatherunit")
      : "celsius"
  );
  const { location, locationLoaded, locationError } = useLocation();
  useEffect(() => {
    if (locationLoaded && !locationError) {
      fetch(
        `https://api.open-meteo.com/v1/forecast?&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,cloudcover,visibility,windspeed_10m,winddirection_10m,soil_temperature_0cm,soil_moisture_0_1cm,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&past_days=6&timezone=auto&latitude=${
          location?.data?.lat
        }&longitude=${location?.data?.lon}${
          weatherUnit == "fahrenheit" ? "&temperature_unit=fahrenheit" : ""
        }`
      )
        .then((response) => {
          if (response.status == 200) {
            return response.json();
          } else {
            throw new Error("Error getting weather data");
          }
        })
        .then((data) => {
          setWeatherData(data);
          setDataError(false);
          setDataLoaded(true);
        })
        .catch(() => {
          setDataError(true);
          setDataLoaded(true);
        });
    } else if (locationLoaded && locationError) {
      setDataError(true);
      setDataLoaded(true);
    }
  }, [location, locationLoaded, weatherUnit]);

  useEffect(() => {
    localStorage.setItem("weatherunit", weatherUnit);
  }, [weatherUnit]);

  useEffect(() => {
    const refreshData = setInterval(async () => {
      if (!locationError) {
        fetch(
          `https://api.open-meteo.com/v1/forecast?&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,cloudcover,visibility,windspeed_10m,winddirection_10m,soil_temperature_0cm,soil_moisture_0_1cm,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&past_days=6&timezone=auto&latitude=${
            location?.data?.lat
          }&longitude=${location?.data?.lon}${
            weatherUnit == "fahrenheit" ? "&temperature_unit=fahrenheit" : ""
          }`
        )
          .then((response) => {
            if (response.status == 200) {
              return response.json();
            } else {
              throw new Error("Error getting weather data");
            }
          })
          .then((data) => {
            setWeatherData(data);
          })
          .catch(() => {});
      }
    }, 5 * 60 * 1000);
    return () => {
      clearInterval(refreshData);
    };
  }, [location, locationLoaded, weatherUnit]);
  return (
    <WeatherDataContext.Provider
      value={{
        weatherData,
        setWeatherData,
        weatherUnit,
        setWeatherUnit,
        dataLoaded,
        dataError,
      }}
    >
      {children}
    </WeatherDataContext.Provider>
  );
}
