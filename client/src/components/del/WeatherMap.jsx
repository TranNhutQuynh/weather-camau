import React, { useState, useEffect, useRef } from "react";
import { MapPin, Layers, Maximize2, Minimize2, RefreshCw } from "lucide-react";
import styles from "../styles/WeatherMap.module.css";

export default function WeatherMap() {
  const [mapType, setMapType] = useState("openweather"); // 'openweather', 'windy', 'openstreet'
  const [layer, setLayer] = useState("temp"); // 'temp', 'precipitation', 'clouds', 'wind'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

  // Tọa độ trung tâm Cà Mau
  const center = {
    lat: 9.1526,
    lon: 105.196,
    zoom: 10,
  };

  const OPENWEATHER_API_KEY =
    import.meta.env.VITE_API_KEY || "YOUR_API_KEY";

  // Map layers
  const layers = [
    { id: "temp", name: "Nhiệt độ", color: "#ef4444" },
    { id: "precipitation", name: "Lượng mưa", color: "#3b82f6" },
    { id: "clouds", name: "Mây", color: "#9ca3af" },
    { id: "wind", name: "Gió", color: "#10b981" },
  ];

  const getOpenWeatherMapUrl = () => {
    const layerMap = {
      temp: "temp_new",
      precipitation: "precipitation_new",
      clouds: "clouds_new",
      wind: "wind_new",
    };

    return `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${OPENWEATHER_API_KEY}`;
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (mapRef.current.requestFullscreen) {
        mapRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [layer, mapType]);

  return (
    <section className={styles.mapSection} id="ban-do">
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>
          <MapPin className={styles.titleIcon} />
          Bản đồ thời tiết Cà Mau
        </h2>

        {/* Map Type Selector */}
        <div className={styles.mapTypeSelector}>
          <button
            className={`${styles.typeBtn} ${
              mapType === "openweather" ? styles.active : ""
            }`}
            onClick={() => setMapType("openweather")}
          >
            OpenWeather
          </button>
          <button
            className={`${styles.typeBtn} ${
              mapType === "windy" ? styles.active : ""
            }`}
            onClick={() => setMapType("windy")}
          >
            Windy
          </button>
          <button
            className={`${styles.typeBtn} ${
              mapType === "openstreet" ? styles.active : ""
            }`}
            onClick={() => setMapType("openstreet")}
          >
            OpenStreetMap
          </button>
        </div>
      </div>

      {/* Layer Controls */}
      <div className={styles.controls}>
        <div className={styles.layerSelector}>
          <Layers className={styles.controlIcon} />
          <span className={styles.controlLabel}>Lớp hiển thị:</span>
          {layers.map((l) => (
            <button
              key={l.id}
              className={`${styles.layerBtn} ${
                layer === l.id ? styles.active : ""
              }`}
              onClick={() => setLayer(l.id)}
              style={
                layer === l.id ? { borderColor: l.color, color: l.color } : {}
              }
            >
              {l.name}
            </button>
          ))}
        </div>

        <button
          className={styles.fullscreenBtn}
          onClick={handleFullscreen}
          title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize2 /> : <Maximize2 />}
        </button>
      </div>

      {/* Map Container */}
      <div
        ref={mapRef}
        className={`${styles.mapContainer} ${
          isFullscreen ? styles.fullscreen : ""
        }`}
      >
        {isLoading && (
          <div className={styles.loading}>
            <RefreshCw className={styles.spinner} />
            <p>Đang tải bản đồ...</p>
          </div>
        )}

        {/* OpenWeather Map */}
        {mapType === "openweather" && !isLoading && (
          <div className={styles.mapWrapper}>
            <iframe
              src={`https://openweathermap.org/weathermap?basemap=map&cities=true&layer=${layer}&lat=${center.lat}&lon=${center.lon}&zoom=${center.zoom}`}
              className={styles.mapFrame}
              title="OpenWeather Map"
              allowFullScreen
            />
            <div className={styles.mapOverlay}>
              <div className={styles.legend}>
                <h4>Chú thích: {layers.find((l) => l.id === layer)?.name}</h4>
                <p className={styles.legendNote}>
                  Dữ liệu từ OpenWeatherMap - Cập nhật thời gian thực
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Windy Map */}
        {mapType === "windy" && !isLoading && (
          <div className={styles.mapWrapper}>
            <iframe
              src={`https://embed.windy.com/embed2.html?lat=${center.lat}&lon=${center.lon}&detailLat=${center.lat}&detailLon=${center.lon}&width=650&height=450&zoom=${center.zoom}&level=surface&overlay=temp&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`}
              className={styles.mapFrame}
              title="Windy Map"
              allowFullScreen
            />
          </div>
        )}

        {/* OpenStreetMap with Weather Overlay */}
        {mapType === "openstreet" && !isLoading && (
          <div className={styles.mapWrapper}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                center.lon - 0.5
              },${center.lat - 0.5},${center.lon + 0.5},${
                center.lat + 0.5
              }&layer=mapnik&marker=${center.lat},${center.lon}`}
              className={styles.mapFrame}
              title="OpenStreetMap"
              allowFullScreen
            />
            <div className={styles.mapOverlay}>
              <div className={styles.osmNote}>
                <MapPin className={styles.noteIcon} />
                <div>
                  <h4>Bản đồ OpenStreetMap</h4>
                  <p>Khu vực: Tỉnh Cà Mau</p>
                  <p>
                    Tọa độ: {center.lat}, {center.lon}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <button
          className={styles.actionBtn}
          onClick={() =>
            window.open(
              `https://www.google.com/maps/@${center.lat},${center.lon},${center.zoom}z`,
              "_blank"
            )
          }
        >
          <MapPin className={styles.actionIcon} />
          Mở trong Google Maps
        </button>

        <button
          className={styles.actionBtn}
          onClick={() =>
            window.open(
              `https://openweathermap.org/city/${center.lat},${center.lon}`,
              "_blank"
            )
          }
        >
          <Layers className={styles.actionIcon} />
          Xem chi tiết trên OpenWeather
        </button>

        <button
          className={styles.actionBtn}
          onClick={() =>
            window.open(
              `https://www.windy.com/${center.lat}/${center.lon}?${center.lat},${center.lon},10`,
              "_blank"
            )
          }
        >
          <RefreshCw className={styles.actionIcon} />
          Mở Windy.com
        </button>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <h4>ℹ️ Hướng dẫn sử dụng</h4>
        <ul>
          <li>
            <strong>Chọn loại bản đồ:</strong> OpenWeather (khuyến nghị), Windy
            (chi tiết), hoặc OpenStreetMap
          </li>
          <li>
            <strong>Chọn lớp hiển thị:</strong> Nhiệt độ, Lượng mưa, Mây, hoặc
            Gió
          </li>
          <li>
            <strong>Toàn màn hình:</strong> Click nút ⛶ để xem bản đồ toàn màn
            hình
          </li>
          <li>
            <strong>Tương tác:</strong> Click vào bản đồ để zoom, drag để di
            chuyển
          </li>
          <li>
            <strong>Mở trong app:</strong> Sử dụng các nút phía dưới để mở trong
            Google Maps hoặc các app khác
          </li>
        </ul>
      </div>
    </section>
  );
}