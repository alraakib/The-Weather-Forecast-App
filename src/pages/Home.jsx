import moment from "moment/moment";
import { useEffect, useState } from "react";
import AnimatedDiv from "../components/AnimatedDiv";
import { useLocation } from "../contexts/LocationProvider";
import { useThemeColor } from "../contexts/ThemeProvider";
import {
  useWeatherCondition,
  useWeatherData,
} from "../contexts/WeatherDataProvider";

export default function Home() {
  const [dateTime, setDateTime] = useState(moment().format("LL - LTS"));
  const { dataError, dataLoaded, weatherData } = useWeatherData();
  const {
    location,
    setLocation,
    setLocationAccess,
    locationLoaded,
    locationError,
  } = useLocation();
  const primaryColor = useThemeColor("primary");
  const secondaryColor = useThemeColor("secondary");

  // get users precise location from geolocation api
  const locate = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
          )
            .then((response) => {
              if (response.status == 200) {
                return response.json();
              } else {
                throw new Error("Error getting location data");
              }
            })
            .then((data) => {
              const {
                latitude,
                longitude,
                countryName,
                principalSubdivision,
                city,
              } = data;
              setLocation({
                preciseLocation: true,
                data: {
                  lat: latitude,
                  lon: longitude,
                  country: countryName,
                  regionName: principalSubdivision,
                  city: city,
                },
              });
              setLocationAccess(true);
            })
            .catch((error) => {
              alert(error.message);
            });
        },
        (error) => {
          alert(error.message);
        }
      );
    } else {
      alert("Sorry, geolocation service isn't available in your device!");
    }
  };

  // update the timer
  const clock = () => {
    setDateTime(moment().format("LL - LTS"));
  };
  useEffect(() => {
    const interval = setInterval(clock, 1000);
    return () => clearInterval(interval);
  });

  if (!dataLoaded) {
    return (
      <AnimatedDiv
        config={{
          animation: "zoom-in",
          className: "flex items-center gap-5 justify-center w-full mx-auto",
        }}
      >
        <p className="text-2xl text-center text-primary backdrop-grayscale">
          Loading weather Data
        </p>
      </AnimatedDiv>
    );
  } else if ((dataLoaded && dataError) || (locationLoaded && locationError)) {
    return (
      <AnimatedDiv
        config={{
          animation: "zoom-in",
          className: "text-center text-primary text-2xl",
        }}
      >
        Error getting weather data!
      </AnimatedDiv>
    );
  } else if (locationLoaded && !locationError && dataLoaded && !dataError) {
    return (
      <div className="flex flex-col items-start justify-between gap-20 lg:flex-row">
        <div className="min-w-[310px]">
          {/* Location Component */}
          <AnimatedDiv
            config={{
              animation: "zoom-out",
              className: "flex items-center gap-3",
            }}
          >
            <img
              src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/marker.png`}
              alt=""
            />
            <div>
              <h3 className="font-semibold text-1xl">{`${location.data.city}, ${location.data.regionName}, ${location.data.country}`}</h3>
              <div className="flex flex-col items-start gap-0 sm:gap-2 sm:items-center sm:flex-row">
                <p className=" text-secondary">{`${
                  location.preciseLocation
                    ? "Precise location"
                    : "Your internet location"
                }`}</p>
                <p
                  onClick={locate}
                  className="flex items-center gap-1 border-b-2 cursor-pointer dark:border-neutral-700 border-neutral-300 text-secondary w-fit"
                >
                  <span>
                    <img
                      src={`https://img.icons8.com/fluency-systems-regular/20/${secondaryColor}/center-direction.png`}
                      alt=""
                    />
                  </span>
                  {`${
                    location.preciseLocation ? "Locate again" : "Use precise"
                  }`}
                </p>
              </div>
            </div>
          </AnimatedDiv>
          {/* Time Component */}
          <AnimatedDiv
            config={{
              animation: "fade-left",
              className: "mt-20",
            }}
          >
            <h3 className="font-semibold text-1xl">Weather Now</h3>
            <p className="text-lg text-secondary">{dateTime}</p>
          </AnimatedDiv>
          {/* Weather Component */}
          <AnimatedDiv
            config={{
              animation: "zoom-in",
              className: "mt-20",
            }}
          >
            <div className="flex items-center gap-3">
              <img
                src={`../../assets/${
                  useWeatherCondition(
                    weatherData.current_weather.weathercode,
                    weatherData.current_weather.is_day
                  ).icon
                }`}
                alt={
                  useWeatherCondition(
                    weatherData.current_weather.weathercode,
                    weatherData.current_weather.is_day
                  ).condition
                }
                className="max-w-[100px] max-h-[100px] object-scale-down"
              />
              <h1 className="leading-normal text-7xl">
                {weatherData.current_weather.temperature}
                <sup className="text-3xl leading-normal align-top top-4">
                  {` ${weatherData.hourly_units.apparent_temperature}`}
                </sup>
              </h1>
            </div>
          </AnimatedDiv>
          {/* Weather Condition Component */}
          <AnimatedDiv
            config={{
              animation: "fade-right",
              className: "mt-20",
            }}
          >
            <h3 className="font-semibold text-1xl">
              {
                useWeatherCondition(weatherData.current_weather.weathercode)
                  .condition
              }
            </h3>
            <p className="text-lg text-secondary">{`Feels like ${
              weatherData.hourly.apparent_temperature[
                weatherData.hourly.time.indexOf(
                  weatherData.current_weather.time.split("T")[0] + "T00:00"
                )
              ]
            }${weatherData.hourly_units.apparent_temperature}`}</p>
          </AnimatedDiv>
        </div>
        <div className="min-w-[310px] w-full lg:max-w-xs">
          {/* Weather Statistics Component */}
          <AnimatedDiv
            config={{
              animation: "fade-right",
            }}
          >
            <h3 className="font-semibold text-1xl">Weather Statistics Today</h3>
            <p className="text-lg text-secondary">{`In ${location.data.city}, ${location.data.country}`}</p>
          </AnimatedDiv>
          <div className="flex flex-col gap-3 mt-20 divide-y-2 dark:divide-neutral-700 divide-neutral-300">
            <AnimatedDiv
              config={{
                animation: "fade-left",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/sunrise.png`}
                  alt="Sunrise"
                />
                <p className="text-lg font-semibold">Sunrise</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {moment(weatherData.daily.sunrise[7]).format("h:mm a")}
              </p>
            </AnimatedDiv>
            <AnimatedDiv
              config={{
                animation: "fade-right",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/sunset.png`}
                  alt="Sunrise"
                />
                <p className="text-lg font-semibold">Sunset</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {moment(weatherData.daily.sunset[7]).format("h:mm a")}
              </p>
            </AnimatedDiv>
            <AnimatedDiv
              config={{
                animation: "fade-left",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/thermometer-up.png`}
                  alt="Max Temperature"
                />
                <p className="text-lg font-semibold">Max Temperature</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {`${weatherData.daily.temperature_2m_max[7]} ${weatherData.daily_units.temperature_2m_max}`}
              </p>
            </AnimatedDiv>
            <AnimatedDiv
              config={{
                animation: "fade-right",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/thermometer-down.png`}
                  alt="Min Temperature"
                />
                <p className="text-lg font-semibold">Min Temperature</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {`${weatherData.daily.temperature_2m_min[7]} ${weatherData.daily_units.temperature_2m_min}`}
              </p>
            </AnimatedDiv>
            <AnimatedDiv
              config={{
                animation: "fade-left",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/hail.png`}
                  alt="Sunrise"
                />
                <p className="text-lg font-semibold">Precipitation Sum</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {`${weatherData.daily.precipitation_sum[7]} ${weatherData.daily_units.precipitation_sum}`}
              </p>
            </AnimatedDiv>
            <AnimatedDiv
              config={{
                animation: "fade-right",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/wind-speed-43-47.png`}
                  alt="Wind Speed"
                />
                <p className="text-lg font-semibold">Wind Speed</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {`${weatherData.daily.windspeed_10m_max[7]} ${weatherData.daily_units.windspeed_10m_max}`}
              </p>
            </AnimatedDiv>
            <AnimatedDiv
              config={{
                animation: "fade-left",
                className: "flex items-center justify-between pt-4",
              }}
            >
              <div className="flex items-center gap-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/windsock.png`}
                  alt="Wind Direction"
                />
                <p className="text-lg font-semibold">Wind Direction</p>
              </div>
              <p className="text-[1.25rem] text-secondary">
                {`${weatherData.daily.winddirection_10m_dominant[7]}${weatherData.daily_units.winddirection_10m_dominant}`}
              </p>
            </AnimatedDiv>
          </div>
        </div>
      </div>
    );
  }
}
