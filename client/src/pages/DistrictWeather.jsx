import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  TrendingUp,
  TrendingDown,
  Calendar,
  Cloud,
  Loader,
  ExternalLink,
  Info
} from "lucide-react";
import styles from "../styles/DistrictWeather.module.css";

export default function DistrictWeather({ selectedLocation }) {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Danh sách các huyện/thành phố của Cà Mau (bao gồm Bạc Liêu cũ)
  const DISTRICTS = [
    // Tỉnh Cà Mau cũ
    { id: "ca-mau-city", name: "Thành phố Cà Mau", region: "Cà Mau", lat: 9.1526, lon: 105.196 },
    { id: "u-minh", name: "Huyện U Minh", region: "Cà Mau", lat: 9.0167, lon: 105.0333 },
    { id: "thoi-binh", name: "Huyện Thới Bình", region: "Cà Mau", lat: 9.2333, lon: 105.15 },
    { id: "tran-van-thoi", name: "Huyện Trần Văn Thời", region: "Cà Mau", lat: 9.0, lon: 104.95 },
    { id: "cai-nuoc", name: "Huyện Cái Nước", region: "Cà Mau", lat: 9.0167, lon: 105.0833 },
    { id: "dam-doi", name: "Huyện Đầm Dơi", region: "Cà Mau", lat: 9.1, lon: 105.15 },
    { id: "nam-can", name: "Huyện Nam Căn", region: "Cà Mau", lat: 8.75, lon: 105.0833 },
    { id: "phu-tan", name: "Huyện Phú Tân", region: "Cà Mau", lat: 9.1333, lon: 105.2667 },
    { id: "ngoc-hien", name: "Huyện Ngọc Hiển", region: "Cà Mau", lat: 8.6667, lon: 104.9333 },
    
    // Tỉnh Bạc Liêu cũ (nay sáp nhập)
    { id: "bac-lieu-city", name: "Thành phố Bạc Liêu", region: "Bạc Liêu (cũ)", lat: 9.294, lon: 105.7215 },
    { id: "hong-dan", name: "Huyện Hồng Dân", region: "Bạc Liêu (cũ)", lat: 9.4833, lon: 105.4167 },
    { id: "phuoc-long", name: "Huyện Phước Long", region: "Bạc Liêu (cũ)", lat: 9.3667, lon: 105.6333 },
    { id: "vinh-loi", name: "Huyện Vĩnh Lợi", region: "Bạc Liêu (cũ)", lat: 9.2833, lon: 105.55 },
    { id: "gia-rai", name: "Huyện Giá Rai", region: "Bạc Liêu (cũ)", lat: 9.3167, lon: 105.6667 },
    { id: "dong-hai", name: "Huyện Đông Hải", region: "Bạc Liêu (cũ)", lat: 9.1667, lon: 105.5833 },
    { id: "hoa-binh", name: "Huyện Hòa Bình", region: "Bạc Liêu (cũ)", lat: 9.3833, lon: 105.7833 },
  ];

  useEffect(() => {
    setDistricts(DISTRICTS);
    fetchAllDistrictsWeather();
  }, []);

  // Xử lý khi có location được chọn từ search
  useEffect(() => {
    if (selectedLocation) {
      handleLocationFromSearch(selectedLocation);
    }
  }, [selectedLocation]);

  const handleLocationFromSearch = async (locationData) => {
    try {
      setDetailLoading(true);
      
      // Tạo district object từ search data
      const district = {
        id: `search-${Date.now()}`,
        name: locationData.location.displayName || locationData.location.name,
        region: "Kết quả tìm kiếm",
        lat: locationData.location.lat,
        lon: locationData.location.lon
      };

      setSelectedDistrict(district);

      // Nếu đã có weather data từ search, dùng luôn
      if (locationData.weather) {
        setWeatherData(prev => ({
          ...prev,
          [district.id]: {
            current: locationData.weather,
            forecast: locationData.forecast
          }
        }));
      } else {
        // Nếu không có, fetch mới
        await fetchDistrictDetail(district);
      }

      setDetailLoading(false);
    } catch (error) {
      console.error("Lỗi xử lý location từ search:", error);
      setDetailLoading(false);
    }
  };

  const fetchAllDistrictsWeather = async () => {
    try {
      setLoading(true);
      
      const promises = DISTRICTS.map(async (district) => {
        try {
          const response = await fetch(
            `${API_BASE}/weather/current/${district.lat}/${district.lon}`
          );
          const data = await response.json();
          return { id: district.id, data };
        } catch (error) {
          console.error(`Lỗi lấy thời tiết ${district.name}:`, error);
          return { id: district.id, data: null };
        }
      });

      const results = await Promise.all(promises);
      
      const weatherMap = {};
      results.forEach(result => {
        if (result.data) {
          weatherMap[result.id] = { current: result.data };
        }
      });

      setWeatherData(weatherMap);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi tải thời tiết các huyện:", error);
      setLoading(false);
    }
  };

  const fetchDistrictDetail = async (district) => {
    try {
      setDetailLoading(true);

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${API_BASE}/weather/current/${district.lat}/${district.lon}`),
        fetch(`${API_BASE}/weather/forecast/${district.lat}/${district.lon}`)
      ]);

      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      setWeatherData(prev => ({
        ...prev,
        [district.id]: { current, forecast }
      }));

      setDetailLoading(false);
    } catch (error) {
      console.error("Lỗi lấy chi tiết:", error);
      setDetailLoading(false);
    }
  };

  const handleDistrictClick = async (district) => {
    setSelectedDistrict(district);
    
    if (!weatherData[district.id]?.forecast) {
      await fetchDistrictDetail(district);
    }
  };

  const openGoogleMaps = (lat, lon, name) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const viewOnMap = (lat, lon) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return Sun;
    if (iconCode.includes("01")) return Sun;
    if (iconCode.includes("02") || iconCode.includes("03")) return Cloud;
    if (iconCode.includes("09") || iconCode.includes("10") || iconCode.includes("11")) return CloudRain;
    if (iconCode.includes("50")) return Wind;
    return Sun;
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return "#ef476f";
    if (temp >= 30) return "#ff9f1c";
    if (temp >= 25) return "#ffbf69";
    return "#06ffa5";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} />
        <p>Đang tải thời tiết các huyện...</p>
      </div>
    );
  }

  return (
    <div className={styles.districtWeatherPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Thời tiết các huyện Cà Mau</h1>
          <p className={styles.pageSubtitle}>
            Theo dõi thời tiết chi tiết của {DISTRICTS.length} huyện/thành phố
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.statItem}>
            <MapPin className={styles.statIcon} />
            <div>
              <p className={styles.statValue}>{DISTRICTS.length}</p>
              <p className={styles.statLabel}>Huyện/TP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className={`${styles.infoBox} ${styles.cardSciFi}`}>
        <Info className={styles.infoIcon} />
        <div className={styles.infoContent}>
          <h3>Về tỉnh Cà Mau mới</h3>
          <p>
            Sau khi sáp nhập với tỉnh Bạc Liêu, Cà Mau trở thành tỉnh lớn nhất 
            vùng Đồng bằng sông Cửu Long với {DISTRICTS.length} đơn vị hành chính cấp huyện.
            Click vào từng huyện để xem thông tin chi tiết và nhận chỉ đường.
          </p>
        </div>
      </div>

      {/* Districts Grid */}
      <div className={styles.districtsGrid}>
        {districts.map((district) => {
          const weather = weatherData[district.id]?.current;
          const WeatherIcon = weather ? getWeatherIcon(weather.weather?.[0]?.icon) : Sun;
          const temp = weather ? Math.round(weather.main.temp) : "--";

          return (
            <div
              key={district.id}
              className={`${styles.districtCard} ${styles.cardSciFi}`}
              onClick={() => handleDistrictClick(district)}
            >
              <div className={styles.districtHeader}>
                <div className={styles.districtInfo}>
                  <h3 className={styles.districtName}>{district.name}</h3>
                  <span className={styles.districtRegion}>{district.region}</span>
                </div>
                <button
                  className={styles.mapBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    viewOnMap(district.lat, district.lon);
                  }}
                  title="Xem trên bản đồ"
                >
                  <MapPin />
                </button>
              </div>

              {weather ? (
                <div className={styles.districtWeather}>
                  <div className={styles.weatherMain}>
                    <WeatherIcon 
                      className={styles.weatherIcon} 
                      style={{ color: getTemperatureColor(temp) }}
                    />
                    <div className={styles.tempDisplay}>
                      <span 
                        className={styles.tempValue}
                        style={{ color: getTemperatureColor(temp) }}
                      >
                        {temp}°
                      </span>
                      <span className={styles.tempUnit}>C</span>
                    </div>
                  </div>

                  <div className={styles.weatherDetailsMini}>
                    <div className={styles.detailMini}>
                      <Droplets className={styles.detailIconMini} />
                      <span>{weather.main.humidity}%</span>
                    </div>
                    <div className={styles.detailMini}>
                      <Wind className={styles.detailIconMini} />
                      <span>{Math.round(weather.wind.speed * 3.6)} km/h</span>
                    </div>
                  </div>

                  <p className={styles.weatherCondition}>{weather.weather[0].description}</p>
                </div>
              ) : (
                <div className={styles.noData}>
                  <p>Không có dữ liệu</p>
                </div>
              )}

              <button
                className={styles.navigateBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  openGoogleMaps(district.lat, district.lon, district.name);
                }}
              >
                <Navigation className={styles.navIcon} />
                Chỉ đường
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedDistrict && (
        <div className={styles.modalOverlay} onClick={() => setSelectedDistrict(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedDistrict(null)}>
              ×
            </button>

            {detailLoading ? (
              <div className={styles.modalLoading}>
                <Loader className={styles.spinner} />
                <p>Đang tải chi tiết...</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className={styles.modalHeader}>
                  <div className={styles.modalTitleSection}>
                    <h2 className={styles.modalTitle}>{selectedDistrict.name}</h2>
                    <span className={styles.modalRegion}>{selectedDistrict.region}</span>
                  </div>
                  <div className={styles.modalCoords}>
                    <MapPin className={styles.coordsIcon} />
                    <span>{selectedDistrict.lat.toFixed(4)}, {selectedDistrict.lon.toFixed(4)}</span>
                  </div>
                </div>

                {/* Current Weather Detail */}
                {weatherData[selectedDistrict.id]?.current && (
                  <div className={styles.modalCurrent}>
                    <h3 className={styles.sectionTitleModal}>Thời tiết hiện tại</h3>
                    
                    <div className={styles.currentDisplayLarge}>
                      {React.createElement(
                        getWeatherIcon(weatherData[selectedDistrict.id].current.weather[0].icon),
                        { className: styles.currentIconLarge }
                      )}
                      <div className={styles.currentTempLarge}>
                        <span className={styles.tempLarge}>
                          {Math.round(weatherData[selectedDistrict.id].current.main.temp)}°
                        </span>
                        <span className={styles.conditionLarge}>
                          {weatherData[selectedDistrict.id].current.weather[0].description}
                        </span>
                      </div>
                    </div>

                    <div className={styles.detailsGrid}>
                      <div className={styles.detailItem}>
                        <Thermometer className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Cảm giác như</p>
                          <p className={styles.detailValue}>
                            {Math.round(weatherData[selectedDistrict.id].current.main.feels_like)}°C
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <Droplets className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Độ ẩm</p>
                          <p className={styles.detailValue}>
                            {weatherData[selectedDistrict.id].current.main.humidity}%
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <Wind className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Gió</p>
                          <p className={styles.detailValue}>
                            {Math.round(weatherData[selectedDistrict.id].current.wind.speed * 3.6)} km/h
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <Eye className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Tầm nhìn</p>
                          <p className={styles.detailValue}>
                            {Math.round(weatherData[selectedDistrict.id].current.visibility / 1000)} km
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <Gauge className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Áp suất</p>
                          <p className={styles.detailValue}>
                            {weatherData[selectedDistrict.id].current.main.pressure} mb
                          </p>
                        </div>
                      </div>

                      <div className={styles.detailItem}>
                        <Cloud className={styles.detailIcon} />
                        <div>
                          <p className={styles.detailLabel}>Mây che phủ</p>
                          <p className={styles.detailValue}>
                            {weatherData[selectedDistrict.id].current.clouds.all}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hourly Forecast */}
                {weatherData[selectedDistrict.id]?.forecast && (
                  <div className={styles.modalHourly}>
                    <h3 className={styles.sectionTitleModal}>
                      <Calendar className={styles.titleIcon} />
                      Dự báo 24 giờ tới
                    </h3>
                    <div className={styles.hourlyScrollModal}>
                      {weatherData[selectedDistrict.id].forecast.list.slice(0, 8).map((hour, idx) => {
                        const HourIcon = getWeatherIcon(hour.weather[0].icon);
                        return (
                          <div key={idx} className={styles.hourlyItemModal}>
                            <p className={styles.hourlyTimeModal}>
                              {new Date(hour.dt * 1000).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </p>
                            <HourIcon className={styles.hourlyIconModal} />
                            <p className={styles.hourlyTempModal}>{Math.round(hour.main.temp)}°</p>
                            <div className={styles.hourlyRainModal}>
                              <Droplets className={styles.rainIconMini} />
                              <span>{Math.round(hour.pop * 100)}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.modalActions}>
                  <button
                    className={`${styles.actionBtn} ${styles.primary}`}
                    onClick={() => openGoogleMaps(
                      selectedDistrict.lat,
                      selectedDistrict.lon,
                      selectedDistrict.name
                    )}
                  >
                    <Navigation />
                    Chỉ đường đến đây
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.secondary}`}
                    onClick={() => viewOnMap(selectedDistrict.lat, selectedDistrict.lon)}
                  >
                    <MapPin />
                    Xem trên bản đồ
                  </button>
                  <button
                    className={`${styles.actionBtn} ${styles.secondary}`}
                    onClick={() => window.open(
                      `https://www.google.com/search?q=thời+tiết+${selectedDistrict.name}`,
                      "_blank"
                    )}
                  >
                    <ExternalLink />
                    Tìm kiếm Google
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
