import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useTheme, useThemeColor } from "../contexts/ThemeProvider";
import { useWeatherData } from "../contexts/WeatherDataProvider";

export default function NavBar() {
  const { theme, setTheme } = useTheme();
  const { weatherUnit, setWeatherUnit } = useWeatherData();
  const primaryColor = useThemeColor("primary");
  const secondaryColor = useThemeColor("secondary");
  const navigate = useNavigate();
  const goHome = () => {
    navigate("/", { replace: true });
  };
  return (
    <header className="flex items-center justify-between pb-10 mb-14 border-bottom">
      <nav className="flex gap-6">
        <img
          src={logo}
          alt="Logo"
          onClick={goHome}
          className="cursor-pointer"
        />
        {/* Nav Menu  */}
        <ul className="items-center hidden gap-9 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] transition-[background-size] duration-300 hover:bg-left bg-right bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] dark:to-white to-neutral-700 font-bold dark:text-white text-neutral-950"
                : "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] bg-[length:0%_100%] transition-[background-size] duration-300 hover:bg-left bg-right hover:bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] text-neutral-600 dark:text-neutral-400 hover:text-primary dark:to-white to-neutral-700"
            }
            replace
          >
            Today
          </NavLink>
          <NavLink
            to="/hourly"
            className={({ isActive }) =>
              isActive
                ? "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] transition-[background-size] duration-300 hover:bg-left bg-right bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] dark:to-white to-neutral-700 font-bold dark:text-white text-neutral-950"
                : "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] bg-[length:0%_100%] transition-[background-size] duration-300 hover:bg-left bg-right hover:bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] text-neutral-600 dark:text-neutral-400 hover:text-primary dark:to-white to-neutral-700"
            }
            replace
          >
            Hourly
          </NavLink>
          <NavLink
            to="/thisweek"
            className={({ isActive }) =>
              isActive
                ? "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] transition-[background-size] duration-300 hover:bg-left bg-right bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] dark:to-white to-neutral-700 font-bold dark:text-white text-neutral-950"
                : "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] bg-[length:0%_100%] transition-[background-size] duration-300 hover:bg-left bg-right hover:bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] text-neutral-600 dark:text-neutral-400 hover:text-primary dark:to-white to-neutral-700"
            }
            replace
          >
            This Week
          </NavLink>
          <NavLink
            to="/pastweek"
            className={({ isActive }) =>
              isActive
                ? "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] transition-[background-size] duration-300 hover:bg-left bg-right bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] dark:to-white to-neutral-700 font-bold dark:text-white text-neutral-950"
                : "text-[1.15rem] bg-gradient-to-b from-transparent from-[94%] bg-[length:0%_100%] transition-[background-size] duration-300 hover:bg-left bg-right hover:bg-[length:100%_100%] bg-no-repeat dark:via-white via-neutral-700 via-[94%] text-neutral-600 dark:text-neutral-400 hover:text-primary dark:to-white to-neutral-700"
            }
            replace
          >
            Past Week
          </NavLink>
        </ul>
        {/* Mobile Nav  */}
        <ul className="flex z-50 md:hidden shadow-lg w-[320px] gap-1 justify-between fixed bottom-6 left-0 right-0 mx-auto bg-white dark:bg-neutral-900 p-4 rounded-full border-2 dark:border-neutral-700 border-neutral-200">
          <NavLink to="/" replace>
            {({ isActive }) => (
              <div className="flex items-center gap-2 whitespace-nowrap ps-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/25/${
                    isActive ? primaryColor : secondaryColor
                  }/today.png`}
                  alt="Light Mode"
                />
                <p
                  className={
                    isActive
                      ? "transition-all text-base font-medium max-w-full overflow-hidden duration-300"
                      : "max-w-0 transition-all text-[0px] duration-300 overflow-hidden"
                  }
                >
                  Today
                </p>
              </div>
            )}
          </NavLink>
          <NavLink to="/hourly" replace>
            {({ isActive }) => (
              <div className="flex items-center gap-2 whitespace-nowrap ps-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/25/${
                    isActive ? primaryColor : secondaryColor
                  }/coming-soon.png`}
                  alt="Light Mode"
                />
                <p
                  className={
                    isActive
                      ? "transition-all text-base font-medium max-w-full overflow-hidden duration-300"
                      : "max-w-0 transition-all text-[0px] duration-300 overflow-hidden"
                  }
                >
                  Hourly
                </p>
              </div>
            )}
          </NavLink>
          <NavLink to="/thisweek" replace>
            {({ isActive }) => (
              <div className="flex items-center gap-2 whitespace-nowrap ps-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/25/${
                    isActive ? primaryColor : secondaryColor
                  }/crossed-out-date.png`}
                  alt="Light Mode"
                />
                <p
                  className={
                    isActive
                      ? "transition-all text-base font-medium max-w-full overflow-hidden duration-300"
                      : "max-w-0 transition-all text-[0px] duration-300 overflow-hidden"
                  }
                >
                  This Week
                </p>
              </div>
            )}
          </NavLink>
          <NavLink to="/pastweek" replace>
            {({ isActive }) => (
              <div className="flex items-center gap-2 whitespace-nowrap ps-1">
                <img
                  src={`https://img.icons8.com/fluency-systems-regular/25/${
                    isActive ? primaryColor : secondaryColor
                  }/overtime.png`}
                  alt="Light Mode"
                />
                <p
                  className={
                    isActive
                      ? "transition-all text-base font-medium max-w-full overflow-hidden duration-300"
                      : "max-w-0 transition-all text-[0px] duration-300 overflow-hidden"
                  }
                >
                  Past Week
                </p>
              </div>
            )}
          </NavLink>
        </ul>
      </nav>
      <div className="flex gap-6">
        {/* Theme Button */}
        <button
          className="flex items-center justify-center h-[40px] w-[40px] max-h-[40px] max-w-[40px]"
          onClick={() => {
            setTheme((prevTheme) => {
              return prevTheme == "dark" ? "light" : "dark";
            });
          }}
        >
          <img
            src={
              theme == "dark"
                ? "https://img.icons8.com/fluency-systems-regular/28/ffffff/sun.png"
                : "https://img.icons8.com/fluency-systems-regular/28/404040/bright-moon.png"
            }
            alt=""
          />
        </button>
        {/* Weather unit button */}
        <button
          className="flex items-center justify-center h-[40px] w-[40px] max-h-[40px] max-w-[40px]"
          onClick={() => {
            setWeatherUnit((prevUnit) => {
              return prevUnit == "celsius" ? "fahrenheit" : "celsius";
            });
          }}
        >
          <p className="text-xl">{weatherUnit == "celsius" ? "°C" : "°F"}</p>
        </button>
      </div>
    </header>
  );
}
