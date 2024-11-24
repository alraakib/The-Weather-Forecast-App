import { createContext, useContext, useEffect, useState } from "react";
const LocationContext = createContext();

export function useLocation() {
  return useContext(LocationContext);
}

export default function LocationProvider({ children }) {
  const [locationAccess, setLocationAccess] = useState(
    localStorage.getItem("locationAccess")
      ? localStorage.getItem("locationAccess")
      : false
  );
  const [location, setLocation] = useState({
    preciseLocation: false,
    data: undefined,
  });
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [locationError, setLocationError] = useState(false);

  // fetch the current location
  const fetchLocation = (url, precise) => {
    fetch(url)
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          throw new Error("Error getting location data");
        }
      })
      .then((data) => {
        const { latitude, longitude, countryName, principalSubdivision, city } =
          data;
        setLocation({
          preciseLocation: precise,
          data: {
            lat: latitude,
            lon: longitude,
            country: countryName,
            regionName: principalSubdivision,
            city: city,
          },
        });
        setLocationError(false);
        setLocationLoaded(true);
      })
      .catch(() => {
        setLocationError(true);
        setLocationLoaded(true);
      });
  };

  useEffect(() => {
    localStorage.setItem("locationAccess", locationAccess);
  }, [locationAccess]);

  useEffect(() => {
    if (locationAccess && navigator.geolocation) {
      // Check if user already granted geolocation access if true then use precise location else ip location
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state == "granted") {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              fetchLocation(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`,
                true
              );
            },
            () => {
              fetchLocation(
                "https://api.bigdatacloud.net/data/reverse-geocode-client",
                false
              );
            },
            {
              maximumAge: 0,
              enableHighAccuracy: true,
            }
          );
        } else {
          fetchLocation(
            "https://api.bigdatacloud.net/data/reverse-geocode-client",
            false
          );
        }
      });
    } else {
      fetchLocation(
        "https://api.bigdatacloud.net/data/reverse-geocode-client",
        false
      );
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        locationAccess,
        setLocationAccess,
        locationLoaded,
        locationError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
