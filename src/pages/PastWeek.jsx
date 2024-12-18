import moment from "moment/moment";
import AnimatedDiv from "../components/AnimatedDiv";
import { useLocation } from "../contexts/LocationProvider";
import { useThemeColor } from "../contexts/ThemeProvider";
import {
  useWeatherCondition,
  useWeatherData,
} from "../contexts/WeatherDataProvider";

export default function ThisWeek() {
  const { dataError, dataLoaded, weatherData } = useWeatherData();
  const { locationLoaded, locationError, location } = useLocation();
  const primaryColor = useThemeColor("primary");
  const secondaryColor = useThemeColor("secondary");
  console.log(weatherData);

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
          className: "text-center text-3xl",
        }}
      >
        Error getting weather data!
      </AnimatedDiv>
    );
  } else if (locationLoaded && !locationError && dataLoaded && !dataError) {
    return (
      <div>
        <AnimatedDiv
          config={{
            animation: "zoom-in",
          }}
        >
          <div className="flex flex-row items-center justify-center gap-3">
            <img
              src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/marker.png`}
              alt=""
            />
            <h3 className="font-semibold text-center text-balance text-1xl">{`${location.data.city}, ${location.data.country}`}</h3>
          </div>
        </AnimatedDiv>
        <AnimatedDiv
          config={{
            animation: "zoom-in",
            className: "text-center text-balance text-secondary text-xl",
          }}
        >
          Past week weather overview
        </AnimatedDiv>
        <div className="grid grid-cols-1 gap-3 pt-4 lg:grid-cols-2 xl:grid-cols-3">
          {weatherData.daily.time.map((item, index) => {
            if (
              moment(item).isBefore(weatherData.current_weather.time, "day")
            ) {
              return (
                <div
                  className="rounded-sm border dark:border-neutral-700 dark:border-opacity-30 border-opacity-70 border-neutral-300 p-7 group dark:bg-white bg-neutral-500 bg-opacity-[0.04] dark:bg-opacity-[0.025] flex flex-col gap-3 items-center justify-center"
                  key={item}
                >
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/calendar.png`}
                      alt="Calendar"
                      className="w-7 h-7"
                    />
                    {moment(weatherData.daily.time[index]).format(
                      "dddd, DD MMM YYYY"
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <img
                      src={`../../assets/${
                        useWeatherCondition(
                          weatherData.daily.weather_code[index],
                          1
                        ).icon
                      }`}
                      alt={
                        useWeatherCondition(
                          weatherData.daily.weather_code[index],
                          1
                        ).condition
                      }
                      className="object-scale-down w-16 h-16 max-w-16 max-h-16"
                    />
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-center gap-1">
                        <p className="text-2xl text-balance">
                          <span className="text-lg text-secondary">Max: </span>
                          {Math.round(
                            weatherData.daily.temperature_2m_max[index]
                          )}
                          °C
                        </p>
                        <p className="text-2xl text-balance">
                          <span className="text-lg text-secondary">Min: </span>
                          {Math.round(
                            weatherData.daily.temperature_2m_min[index]
                          )}
                          °C
                        </p>
                      </div>
                      <p className="text-center text-secondary text-balance">
                        {
                          useWeatherCondition(
                            weatherData.daily.weather_code[index],
                            1
                          ).condition
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-2 divide-y-2 dark:divide-neutral-700 divide-neutral-300">
                    <AnimatedDiv
                      config={{
                        animation: "fade-left",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/sunrise.png`}
                          alt="Sunrise"
                        />
                        <p className="text-lg font-semibold">Sunrise</p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {moment(weatherData.daily.sunrise[index]).format(
                          "h:mm a"
                        )}
                      </p>
                    </AnimatedDiv>
                    <AnimatedDiv
                      config={{
                        animation: "fade-right",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/sunset.png`}
                          alt="Sunrise"
                        />
                        <p className="text-lg font-semibold">Sunset</p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {moment(weatherData.daily.sunset[index]).format(
                          "h:mm a"
                        )}
                      </p>
                    </AnimatedDiv>
                    <AnimatedDiv
                      config={{
                        animation: "fade-left",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/midday.png`}
                          alt="Max Temperature"
                        />
                        <p className="text-lg font-semibold">UV Index</p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {weatherData.daily.uv_index_max[index]}
                      </p>
                    </AnimatedDiv>
                    <AnimatedDiv
                      config={{
                        animation: "fade-right",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/rain-gauge.png`}
                          alt="Min Temperature"
                        />
                        <p className="text-lg font-semibold">
                          Precipitation Sum
                        </p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {`${weatherData.daily.precipitation_sum[index]} ${weatherData.daily_units.precipitation_sum}`}
                      </p>
                    </AnimatedDiv>
                    <AnimatedDiv
                      config={{
                        animation: "fade-left",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/barometer.png`}
                          alt="Sunrise"
                        />
                        <p className="text-lg font-semibold">
                          Precipitation Probability
                        </p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {`${weatherData.daily.precipitation_probability_max[index]} ${weatherData.daily_units.precipitation_probability_max}`}
                      </p>
                    </AnimatedDiv>
                    <AnimatedDiv
                      config={{
                        animation: "fade-right",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/wind-speed-43-47.png`}
                          alt="Wind Speed"
                        />
                        <p className="text-lg font-semibold">Max Wind Speed</p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {`${weatherData.daily.windspeed_10m_max[index]} ${weatherData.daily_units.windspeed_10m_max}`}
                      </p>
                    </AnimatedDiv>
                    <AnimatedDiv
                      config={{
                        animation: "fade-left",
                        className: "flex items-center justify-between",
                      }}
                    >
                      <div className="flex items-center gap-1 pt-2">
                        <img
                          src={`https://img.icons8.com/fluency-systems-regular/28/${primaryColor}/windsock.png`}
                          alt="Wind Direction"
                        />
                        <p className="text-lg font-semibold">
                          Dominant Wind Direction
                        </p>
                      </div>
                      <p className="text-[1.25rem] text-secondary">
                        {`${weatherData.daily.winddirection_10m_dominant[index]}${weatherData.daily_units.winddirection_10m_dominant}`}
                      </p>
                    </AnimatedDiv>
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}
