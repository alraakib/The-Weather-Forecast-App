import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import AnimatedDiv from "../components/AnimatedDiv";
import { useLocation } from "../contexts/LocationProvider";
import { useThemeColor } from "../contexts/ThemeProvider";
import {
  useWeatherCondition,
  useWeatherData,
} from "../contexts/WeatherDataProvider";

export default function Hourly() {
  const { locationLoaded, locationError } = useLocation();
  const { dataError, dataLoaded, weatherData } = useWeatherData();
  const primaryColor = useThemeColor("primary");
  const [fromDate, setFromDate] = useState(0);
  const dropownRef = useRef(null);
  useEffect(() => {
    const modalListener = window.addEventListener("click", (e) => {
      if (dropownRef.current && e.target !== dropownRef.current) {
        dropownRef.current.classList.remove("active");
      } else if (dropownRef.current && e.target == dropownRef.current) {
        dropownRef.current.classList.toggle("active");
      }
      return () => removeEventListener(modalListener);
    });
  }, []);

  if (!dataLoaded) {
    return (
      <AnimatedDiv
        config={{
          animation: "zoom-in",
          className: "flex items-center gap-5 justify-center w-full mx-auto",
        }}
      >
        <p className="text-2xl text-center backdrop-grayscale">
          Loading weather Data
        </p>
      </AnimatedDiv>
    );
  } else if ((dataLoaded && dataError) || (locationLoaded && locationError)) {
    return (
      <AnimatedDiv
        config={{
          animation: "zoom-in",
          className: "text-center text-2xl",
        }}
      >
        Error getting weather data!
      </AnimatedDiv>
    );
  } else if (locationLoaded && !locationError && dataLoaded && !dataError) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center justify-center pb-5 overflow-visible md:justify-between md:flex-row">
          <p className="font-semibold text-1xl">Hourly forecast from</p>
          <div
            ref={dropownRef}
            className="relative flex items-center justify-center w-full gap-3 px-3 py-2 overflow-visible cursor-pointer md:justify-end md:w-fit group "
          >
            {`${moment(
              moment(weatherData.current_weather.time).add(fromDate, "hours")
            ).format("DD MMM, h a")} - ${moment(
              moment(weatherData.current_weather.time).add(fromDate, "hours")
            )
              .add(12, "hours")
              .format("DD MMM, h a")}`}
            <img
              src={`https://img.icons8.com/fluency-systems-regular/16/${primaryColor}/expand-arrow--v1.png`}
              alt="Expand"
              className="pointer-events-none group-[.active]:rotate-180 transition-all duration-300"
            />

            <ul className="shadow-md absolute rounded-sm border divide-y-2 divide-neutral-200 dark:divide-neutral-700/50 border-neutral-300 dark:border-neutral-700 scale-50 group-[.active]:scale-100 origin-top md:origin-top-right group-[.active]:opacity-100 group-[.active]:pointer-events-auto pointer-events-none opacity-0 transition-all duration-300 right-0 z-50 w-full md:w-fit py-3 dark:bg-neutral-900 bg-neutral-100 top-full text-end">
              {Array(11)
                .fill(0)
                .map((value, index) => {
                  return (
                    <li
                      key={index}
                      onClick={() => {
                        setFromDate(index * 12);
                      }}
                      className="flex gap-2 justify-center md:justify-end items-center px-6 py-3 text-[1.2rem] text-center md:text-right  hover:dark:bg-white/5 hover:bg-neutral-200"
                    >
                      {fromDate == index * 12 ? (
                        <div className="object-scale-down w-5 h-5">
                          <img
                            alt="Checked"
                            src={`https://img.icons8.com/fluency-systems-regular/20/${primaryColor}/checkmark--v1.png`}
                          />
                        </div>
                      ) : (
                        <div className="object-scale-down w-5 h-5" />
                      )}
                      <p className="text-base whitespace-nowrap">{`${moment(
                        weatherData.current_weather.time
                      )
                        .add(index * 12, "hours")
                        .format("DD MMM, h:00 a")} - ${moment(
                        weatherData.current_weather.time
                      )
                        .add(index * 12 + 12, "hours")
                        .format("DD MMM, h:00 a")}`}</p>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
        {weatherData.hourly.time.map((item, index) => {
          if (
            moment(item).isSameOrAfter(
              moment(weatherData.current_weather.time).add(fromDate, "hours")
            ) &&
            moment(item).isSameOrBefore(
              moment(weatherData.current_weather.time)
                .add(fromDate, "hours")
                .add(12, "hours")
            )
          ) {
            return (
              <AnimatedDiv
                config={{
                  animation: index % 2 == 0 ? "fade-left" : "fade-right",
                }}
                key={item}
              >
                {/* Hourly Component */}
                <div
                  className="flex rounded-sm border dark:border-neutral-700 dark:border-opacity-30 border-opacity-50 border-neutral-300 flex-col px-5 py-3 cursor-pointer group dark:bg-white bg-neutral-500 bg-opacity-[0.04] dark:bg-opacity-[0.025]"
                  id="hourly"
                  onClick={(e) => {
                    document.querySelectorAll("#hourly").forEach((item) => {
                      if (item !== e.target) {
                        item.classList.remove("active");
                      } else {
                        e.target.classList.toggle("active");
                      }
                    });
                  }}
                >
                  <div className="flex flex-col items-center justify-between gap-3 pointer-events-none lg:flex-row">
                    <p className="text-lg font-semibold">
                      {moment(item).format("dddd, DD MMM - hh:mm a")}
                    </p>

                    <div className="flex items-center gap-2 ">
                      <p className="order-3 text-[1.1rem] lg:order-1 text-secondary">
                        {
                          useWeatherCondition(
                            weatherData.hourly.weathercode[index],
                            weatherData.hourly.is_day[index]
                          ).condition
                        }
                      </p>
                      <img
                        src={`../../assets/${
                          useWeatherCondition(
                            weatherData.hourly.weathercode[index],
                            weatherData.hourly.is_day[index]
                          ).icon
                        }`}
                        alt={
                          useWeatherCondition(
                            weatherData.hourly.weathercode[index],
                            weatherData.hourly.is_day[index]
                          ).condition
                        }
                        className="w-[36px] order-1 lg:order-2 h-[36px] max-w-[36px] max-h-[36px] object-scale-down"
                      />
                      <h3 className="order-2 text-2xl font-semibold lg:order-3">
                        {weatherData.hourly.temperature_2m[index]}
                        <sup className="-top-1">
                          {weatherData.hourly_units.temperature_2m}
                        </sup>
                      </h3>
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/14/${primaryColor}/expand-arrow--v1.png`}
                        alt="Expand"
                        className="order-4 group-[.active]:rotate-180 transition duration-300"
                      />
                    </div>
                  </div>
                  {/* Hourly Stats Component */}
                  <div className="grid gap-3 max-h-[0rem] xl:grid-cols-4 grid-cols-1 md:grid-cols-2 group-[.active]:xl:max-h-[19rem] group-[.active]:max-h-[78.125rem] group-[.active]:md:max-h-[40rem] group-[.active]:pt-2 overflow-y-hidden transition-all duration-500 pointer-events-none">
                    {/* Temperature */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/thermometer.png`}
                        alt="Temperature"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Temperature</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.temperature_2m[index]}${weatherData.hourly_units.temperature_2m}`}</h3>
                      </div>
                    </div>
                    {/* Apparent Temp  */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/thermometer.png`}
                        alt="Apparent Temp"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">
                          Apparent Temp
                        </p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.apparent_temperature[index]}${weatherData.hourly_units.apparent_temperature}`}</h3>
                      </div>
                    </div>
                    {/* Wind Speed */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/wind-speed-43-47.png`}
                        alt="Wind Speed"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Wind Speed</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.windspeed_10m[index]} ${weatherData.hourly_units.windspeed_10m}`}</h3>
                      </div>
                    </div>
                    {/* Wind Direction */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/windsock.png`}
                        alt="Wind Direction"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">
                          Wind Direction
                        </p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.winddirection_10m[index]} ${weatherData.hourly_units.winddirection_10m}`}</h3>
                      </div>
                    </div>
                    {/* Precipitaion */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/hail.png`}
                        alt="Precipitaion"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Precipitaion</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.precipitation[index]} ${weatherData.hourly_units.precipitation}`}</h3>
                      </div>
                    </div>
                    {/* Precipitaion Chance */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/hail.png`}
                        alt="Precipitaion Chance"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">
                          Precipitaion Chance
                        </p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.precipitation_probability[index]}${weatherData.hourly_units.precipitation_probability}`}</h3>
                      </div>
                    </div>
                    {/* Humidity */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/humidity.png`}
                        alt="Humidity"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Humidity</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.relativehumidity_2m[index]}${weatherData.hourly_units.relativehumidity_2m}`}</h3>
                      </div>
                    </div>
                    {/* Visibility */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/visible.png`}
                        alt="Visibility"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Visibility</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.visibility[index]}${weatherData.hourly_units.visibility}`}</h3>
                      </div>
                    </div>
                    {/* Cloud Cover */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/cloud.png`}
                        alt="Cloud Cover"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Cloud Cover</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.cloudcover[index]}${weatherData.hourly_units.cloudcover}`}</h3>
                      </div>
                    </div>
                    {/* UV Index */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/sun.png`}
                        alt="UV Index"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">UV Index</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.uv_index[index]}${weatherData.hourly_units.uv_index}`}</h3>
                      </div>
                    </div>
                    {/* Soil Temp */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/temperature.png`}
                        alt="Soil Temp"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">Soil Temp</p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.soil_temperature_0cm[index]}${weatherData.hourly_units.soil_temperature_0cm}`}</h3>
                      </div>
                    </div>
                    {/* Soil Moisture */}
                    <div className="flex items-center justify-center gap-1 py-4 dark:bg-white bg-opacity-[0.035] dark:bg-opacity-[0.01] border dark:border-neutral-700 dark:border-opacity-60 border-opacity-80 border-neutral-300 bg-neutral-800 rounded-sm">
                      <img
                        src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/moisture.png`}
                        alt="Soil Moisture"
                      />
                      <div className="flex flex-col items-center">
                        <p className="text-base text-secondary">
                          Soil Moisture
                        </p>
                        <h3 className="text-lg font-semibold ">{`${weatherData.hourly.soil_moisture_0_1cm[index]} ${weatherData.hourly_units.soil_moisture_0_1cm}`}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedDiv>
            );
          }
        })}
      </div>
    );
  }
}
