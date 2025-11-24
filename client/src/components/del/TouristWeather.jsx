import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  ExternalLink,
  Loader,
  Copy,
  Check,
} from "lucide-react";
import styles from "../styles/TouristWeather.module.css";
import {
  openGoogleMapsNavigation,
  viewLocationOnMap,
} from "../utils/mapsHelper";

export default function TouristWeather() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRegion, setFilterRegion] = useState("all"); // 'all', 'Cà Mau', 'Bạc Liêu (cũ)'
  const [copiedId, setCopiedId] = useState(null);

  // API base URL
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Lấy danh sách địa điểm và thời tiết
  useEffect(() => {
    fetchAllTouristWeather();
  }, []);

  const fetchAllTouristWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/weather/tourist-all`);
      const data = await response.json();

      // Lọc các địa điểm có dữ liệu thành công
      const validData = data.filter((item) => !item.error);
      setLocations(validData);

      // Tạo object weatherData
      const weatherMap = {};
      validData.forEach((item) => {
        weatherMap[item.location.id] = item.weather;
      });
      setWeatherData(weatherMap);

      setLoading(false);
    } catch (err) {
      setError("Không thể tải dữ liệu thời tiết");
      setLoading(false);
    }
  };

  // Mở Google Maps navigation
  const openGoogleMaps = (lat, lon, name) => {
    try {
      // Tạo URL với multiple fallbacks
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodeURIComponent(
        name
      )}`;

      // Thử mở trong tab mới
      const newWindow = window.open(
        googleMapsUrl,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback nếu bị chặn popup
      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        // Thử dùng location.href
        window.location.href = googleMapsUrl;
      }

      console.log("Opening Google Maps:", googleMapsUrl);
    } catch (error) {
      console.error("Error opening Google Maps:", error);
      alert("Không thể mở Google Maps. Vui lòng kiểm tra cài đặt trình duyệt.");
    }
  };

  // Mở Google Maps xem địa điểm
  const viewOnMap = (lat, lon) => {
    try {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

      const newWindow = window.open(
        googleMapsUrl,
        "_blank",
        "noopener,noreferrer"
      );

      if (
        !newWindow ||
        newWindow.closed ||
        typeof newWindow.closed === "undefined"
      ) {
        window.location.href = googleMapsUrl;
      }

      console.log("Viewing on map:", googleMapsUrl);
    } catch (error) {
      console.error("Error viewing map:", error);
      alert("Không thể mở bản đồ. Vui lòng kiểm tra cài đặt trình duyệt.");
    }
  };

  // Lấy icon thời tiết
  const getWeatherIcon = (iconCode) => {
    const iconMap = {
      "01d": Sun,
      "01n": Sun,
      "02d": Sun,
      "02n": Sun,
      "03d": CloudRain,
      "03n": CloudRain,
      "04d": CloudRain,
      "04n": CloudRain,
      "09d": CloudRain,
      "09n": CloudRain,
      "10d": CloudRain,
      "10n": CloudRain,
      "11d": CloudRain,
      "11n": CloudRain,
      "13d": CloudRain,
      "13n": CloudRain,
      "50d": Wind,
      "50n": Wind,
    };
    return iconMap[iconCode] || Sun;
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader className={styles.spinner} />
        <p>Đang tải dữ liệu thời tiết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={fetchAllTouristWeather}>Thử lại</button>
      </div>
    );
  }

  return (
    <section className={styles.touristSection}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          <MapPin className={styles.titleIcon} />
          Thời tiết điểm du lịch Cà Mau (bao gồm Bạc Liêu cũ)
        </h2>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterBtn} ${
              filterRegion === "all" ? styles.active : ""
            }`}
            onClick={() => setFilterRegion("all")}
          >
            Tất cả ({locations.length})
          </button>
          <button
            className={`${styles.filterBtn} ${
              filterRegion === "Cà Mau" ? styles.active : ""
            }`}
            onClick={() => setFilterRegion("Cà Mau")}
          >
            Khu vực Cà Mau (
            {locations.filter((l) => l.location.region === "Cà Mau").length})
          </button>
          <button
            className={`${styles.filterBtn} ${
              filterRegion === "Bạc Liêu (cũ)" ? styles.active : ""
            }`}
            onClick={() => setFilterRegion("Bạc Liêu (cũ)")}
          >
            Khu vực Bạc Liêu cũ (
            {
              locations.filter((l) => l.location.region === "Bạc Liêu (cũ)")
                .length
            }
            )
          </button>
        </div>
      </div>

      <div className={styles.locationGrid}>
        {locations
          .filter(
            (loc) =>
              filterRegion === "all" || loc.location.region === filterRegion
          )
          .map((location) => {
            const weather = weatherData[location.location.id];
            const WeatherIcon = weather?.current?.icon
              ? getWeatherIcon(weather.current.icon)
              : Sun;

            return (
              <div
                key={location.location.id}
                className={styles.locationCard}
                onClick={() => setSelectedLocation(location)}
              >
                {/* Header */}
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.locationNameWrapper}>
                      <h3 className={styles.locationName}>
                        {location.location.name}
                      </h3>
                      <span className={styles.regionBadge}>
                        {location.location.region}
                      </span>
                    </div>
                    <p className={styles.locationDesc}>
                      {location.location.description}
                    </p>
                  </div>
                  <button
                    className={styles.mapBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      viewOnMap(location.location.lat, location.location.lon);
                    }}
                    title="Xem trên bản đồ"
                  >
                    <MapPin className={styles.mapIcon} />
                  </button>
                </div>

                {/* Weather info */}
                {weather && (
                  <div className={styles.weatherInfo}>
                    <div className={styles.tempSection}>
                      <WeatherIcon className={styles.weatherIcon} />
                      <div>
                        <div className={styles.temp}>
                          {weather.current.temp}°C
                        </div>
                        <div className={styles.condition}>
                          {weather.current.condition}
                        </div>
                      </div>
                    </div>

                    <div className={styles.weatherDetails}>
                      <div className={styles.detailItem}>
                        <Droplets className={styles.detailIcon} />
                        <span>{weather.current.humidity}%</span>
                      </div>
                      <div className={styles.detailItem}>
                        <Wind className={styles.detailIcon} />
                        <span>{weather.current.windSpeed} km/h</span>
                      </div>
                      <div className={styles.detailItem}>
                        <CloudRain className={styles.detailIcon} />
                        <span>{weather.hourly[0]?.rain || 0}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attractions */}
                {location.location.attractions && (
                  <div className={styles.attractions}>
                    <p className={styles.attractionsTitle}>Điểm tham quan:</p>
                    <ul className={styles.attractionsList}>
                      {location.location.attractions
                        .slice(0, 2)
                        .map((attraction, idx) => (
                          <li key={idx}>{attraction}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Navigate button */}
                <button
                  className={styles.navigateBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openGoogleMaps(
                      location.location.lat,
                      location.location.lon,
                      location.location.name
                    );
                  }}
                >
                  <Navigation className={styles.navIcon} />
                  Chỉ đường đến đây
                </button>
              </div>
            );
          })}
      </div>

      {/* Modal chi tiết */}
      {selectedLocation && (
        <div className={styles.modal} onClick={() => setSelectedLocation(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeBtn}
              onClick={() => setSelectedLocation(null)}
            >
              ×
            </button>

            <h2>{selectedLocation.location.name}</h2>
            <p className={styles.modalDesc}>
              {selectedLocation.location.description}
            </p>

            {/* Current weather */}
            {weatherData[selectedLocation.location.id] && (
              <div className={styles.modalWeather}>
                <h3>Thời tiết hiện tại</h3>
                <div className={styles.currentWeather}>
                  <div className={styles.temp}>
                    {weatherData[selectedLocation.location.id].current.temp}°C
                  </div>
                  <div className={styles.condition}>
                    {
                      weatherData[selectedLocation.location.id].current
                        .condition
                    }
                  </div>
                </div>

                {/* Hourly forecast */}
                <h3>Dự báo theo giờ</h3>
                <div className={styles.hourlyForecast}>
                  {weatherData[selectedLocation.location.id].hourly
                    .slice(0, 6)
                    .map((hour, idx) => (
                      <div key={idx} className={styles.hourItem}>
                        <div className={styles.hourTime}>{hour.time}</div>
                        <div className={styles.hourTemp}>{hour.temp}°</div>
                        <div className={styles.hourRain}>{hour.rain}%</div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Attractions */}
            {selectedLocation.location.attractions && (
              <div className={styles.modalAttractions}>
                <h3>Điểm tham quan</h3>
                <ul>
                  {selectedLocation.location.attractions.map(
                    (attraction, idx) => (
                      <li key={idx}>{attraction}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className={styles.modalActions}>
              <button
                className={styles.primaryBtn}
                onClick={() =>
                  openGoogleMaps(
                    selectedLocation.location.lat,
                    selectedLocation.location.lon,
                    selectedLocation.location.name
                  )
                }
              >
                <Navigation />
                Chỉ đường
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() =>
                  viewOnMap(
                    selectedLocation.location.lat,
                    selectedLocation.location.lon
                  )
                }
              >
                <MapPin />
                Xem trên bản đồ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
