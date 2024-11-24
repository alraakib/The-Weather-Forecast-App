import AOS from "aos";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import LocationProvider from "./contexts/LocationProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import WeatherDataProvider from "./contexts/WeatherDataProvider";
import Home from "./pages/Home";
import Hourly from "./pages/Hourly";
import PastWeek from "./pages/PastWeek";
import ThisWeek from "./pages/ThisWeek";

import "aos/dist/aos.css";

function App() {
  useEffect(() => {
    AOS.init({ once: true });
    // DisableDevtool();
  }, []);

  return (
    <ThemeProvider>
      <LocationProvider>
        <WeatherDataProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hourly" element={<Hourly />} />
              <Route path="/thisweek" element={<ThisWeek />} />
              <Route path="/pastweek" element={<PastWeek />} />
            </Routes>
          </BrowserRouter>
        </WeatherDataProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
