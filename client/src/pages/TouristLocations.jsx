import React, { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Compass,
  Star,
  Camera,
  Info,
  Loader,
  ExternalLink,
  Filter,
  Calendar,
  Clock,
  Users,
  Heart,
  Share,
  X,
  Eye,
} from "lucide-react";
import styles from "../styles/TouristLocations.module.css";

export default function TouristLocations() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'compact'
  const [sortBy, setSortBy] = useState("default"); // 'default', 'rating', 'name'

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchTouristWeather();
  }, []);

  const fetchTouristWeather = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/weather/tourist-all`);
      const data = await response.json();

      const validData = data.filter((item) => !item.error);
      setLocations(validData);

      const weatherMap = {};
      validData.forEach((item) => {
        weatherMap[item.location.id] = item.weather;
      });
      setWeatherData(weatherMap);

      setLoading(false);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
      setLoading(false);
    }
  };

  const openGoogleMaps = (lat, lon, name) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&destination_place_id=${encodeURIComponent(
      name
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const viewOnMap = (lat, lon) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const getWeatherIcon = (iconCode) => {
    if (!iconCode) return Sun;
    if (iconCode.includes("01")) return Sun;
    if (
      iconCode.includes("09") ||
      iconCode.includes("10") ||
      iconCode.includes("11")
    )
      return CloudRain;
    return Sun;
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return "#ef476f";
    if (temp >= 30) return "#ff9f1c";
    if (temp >= 25) return "#ffbf69";
    return "#06ffa5";
  };

  // Filter và sort locations
  const filteredLocations = locations
    .filter(
      (loc) => filterRegion === "all" || loc.location.region === filterRegion
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.location.rating || 4.5) - (a.location.rating || 4.5);
        case "name":
          return a.location.name.localeCompare(b.location.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader className={styles.spinner} />
        <p>Đang tải thông tin điểm du lịch...</p>
      </div>
    );
  }

  return (
    <div className={styles.touristPage}>
      {/* Header với thống kê */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerMain}>
            <div className={styles.headerIconWrapper}>
              <Compass className={styles.headerIcon} />
            </div>
            <div className={styles.headerText}>
              <h1 className={styles.pageTitle}>Điểm du lịch Cà Mau</h1>
              <p className={styles.pageSubtitle}>
                Khám phá {locations.length} điểm du lịch hấp dẫn với thông tin
                thời tiết chi tiết
              </p>
            </div>
          </div>

          <div className={styles.headerStats}>
            <div className={styles.statCard}>
              <MapPin className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>{locations.length}</span>
                <span className={styles.statLabel}>Điểm du lịch</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <Users className={styles.statIcon} />
              <div className={styles.statInfo}>
                <span className={styles.statNumber}>4.5</span>
                <span className={styles.statLabel}>Đánh giá TB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.viewControls}>
          <button
            className={`${styles.viewBtn} ${
              viewMode === "grid" ? styles.active : ""
            }`}
            onClick={() => setViewMode("grid")}
          >
            Lưới
          </button>
          <button
            className={`${styles.viewBtn} ${
              viewMode === "compact" ? styles.active : ""
            }`}
            onClick={() => setViewMode("compact")}
          >
            Danh sách
          </button>
        </div>

        <div className={styles.filterControls}>
          <div className={styles.filterGroup}>
            <Filter className={styles.filterIcon} />
            <select
              className={styles.filterSelect}
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="all">Tất cả khu vực</option>
              <option value="Cà Mau">Cà Mau</option>
              <option value="Bạc Liêu (cũ)">Bạc Liêu (cũ)</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.sortLabel}>Sắp xếp:</span>
            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Mặc định</option>
              <option value="rating">Đánh giá cao</option>
              <option value="name">Theo tên</option>
            </select>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`${styles.infoBanner} ${styles.cardSciFi}`}>
        <Info className={styles.bannerIcon} />
        <div className={styles.bannerContent}>
          <h3>📌 Lưu ý khi du lịch Cà Mau</h3>
          <p>
            Thời tiết nhiệt đới gió mùa, nhiệt độ trung bình 27-33°C. Nên mang
            theo nước uống, kem chống nắng và trang phục nhẹ nhàng. Kiểm tra dự
            báo thời tiết trước khi đi các điểm sinh thái.
          </p>
        </div>
      </div>

      {/* Locations Grid/List */}
      <div
        className={`${styles.locationsContainer} ${
          viewMode === "compact" ? styles.compactView : styles.gridView
        }`}
      >
        {filteredLocations.map((location) => {
          const weather = weatherData[location.location.id];
          const WeatherIcon = weather?.current?.icon
            ? getWeatherIcon(weather.current.icon)
            : Sun;

          if (viewMode === "compact") {
            return (
              <div
                key={location.location.id}
                className={`${styles.locationCompactCard} ${styles.cardSciFi}`}
                onClick={() => setSelectedLocation(location)}
              >
                {/* Thêm hình ảnh compact */}
                {location.location.image ? (
                  <img
                    src={location.location.image}
                    alt={location.location.name}
                    className={styles.compactImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={
                    location.location.image
                      ? styles.compactImagePlaceholder
                      : ""
                  }
                  style={{ display: location.location.image ? "none" : "flex" }}
                >
                  <Camera className={styles.compactPlaceholderIcon} />
                </div>

                <div className={styles.compactMain}>
                  <div className={styles.compactInfo}>
                    <h3 className={styles.locationNameCompact}>
                      {location.location.name}
                    </h3>
                    <div className={styles.compactMeta}>
                      <span className={styles.regionBadge}>
                        {location.location.region}
                      </span>
                      <div className={styles.ratingCompact}>
                        <Star className={styles.starIcon} />
                        <span>{location.location.rating || 4.5}</span>
                      </div>
                    </div>
                    <p className={styles.locationDescCompact}>
                      {location.location.description}
                    </p>
                  </div>

                  <div className={styles.compactWeather}>
                    <WeatherIcon
                      className={styles.weatherIconCompact}
                      style={{
                        color: getTemperatureColor(
                          weather?.current?.temp || 25
                        ),
                      }}
                    />
                    <div className={styles.tempCompact}>
                      <span
                        className={styles.tempValueCompact}
                        style={{
                          color: getTemperatureColor(
                            weather?.current?.temp || 25
                          ),
                        }}
                      >
                        {weather?.current?.temp || "--"}°
                      </span>
                      <span className={styles.conditionCompact}>
                        {weather?.current?.condition || "--"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={styles.compactActions}>
                  <button
                    className={styles.actionBtnCompact}
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMaps(
                        location.location.lat,
                        location.location.lon,
                        location.location.name
                      );
                    }}
                  >
                    <Navigation size={16} />
                    Đường đi
                  </button>
                  <button
                    className={styles.actionBtnCompactSecondary}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(location);
                    }}
                  >
                    <ExternalLink size={16} />
                    Chi tiết
                  </button>
                </div>
              </div>
            );
          }

          // Grid View
          return (
            <div
              key={location.location.id}
              className={`${styles.touristCard} ${styles.cardSciFi}`}
              onClick={() => setSelectedLocation(location)}
            >
              {/* Phần hình ảnh */}
              <div className={styles.imageContainer}>
                <img
                  src={location.location.image}
                  alt={location.location.name}
                  className={styles.locationImage}
                  onLoad={(e) => console.log("Image loaded:", e.target.src)}
                  onError={(e) => {
                    console.log("Failed to load image:", e.target.src);
                    e.target.style.display = "none";
                    const placeholder = e.target.nextElementSibling;
                    if (placeholder) placeholder.style.display = "flex";
                  }}
                />
                <div
                  className={styles.imagePlaceholder}
                  style={{ display: "none" }}
                >
                  <Camera className={styles.placeholderIcon} />
                  <span>Ảnh đang tải...</span>
                </div>

                <div className={styles.imageOverlay}>
                  <span className={styles.regionBadge}>
                    {location.location.region}
                  </span>
                </div>
              </div>
              {/* Card Header */}
              <div className={styles.cardHeaderTourist}>
                <div className={styles.locationBadge}>
                  <MapPin className={styles.badgeIcon} />
                  <span>{location.location.region}</span>
                </div>
                <div className={styles.cardActions}>
                  <div className={styles.rating}>
                    <Star className={styles.starIcon} />
                    <span>{location.location.rating || 4.5}</span>
                  </div>
                  <button
                    className={styles.favoriteBtn}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart size={16} />
                  </button>
                </div>
              </div>
              {/* Location Info */}
              <div className={styles.locationInfo}>
                <h3 className={styles.locationNameTourist}>
                  {location.location.name}
                </h3>
                <p className={styles.locationDescTourist}>
                  {location.location.description}
                </p>
              </div>
              {/* Weather Info */}
              {weather && (
                <div className={styles.weatherSectionTourist}>
                  <div className={styles.weatherDisplayTourist}>
                    <WeatherIcon
                      className={styles.weatherIconTourist}
                      style={{
                        color: getTemperatureColor(weather.current.temp),
                      }}
                    />
                    <div className={styles.tempInfoTourist}>
                      <span
                        className={styles.tempTourist}
                        style={{
                          color: getTemperatureColor(weather.current.temp),
                        }}
                      >
                        {weather.current.temp}°
                      </span>
                      <span className={styles.conditionTourist}>
                        {weather.current.condition}
                      </span>
                    </div>
                  </div>

                  <div className={styles.weatherDetailsTourist}>
                    <div className={styles.detailTourist}>
                      <Droplets className={styles.detailIconSmall} />
                      <span>{weather.current.humidity}%</span>
                    </div>
                    <div className={styles.detailTourist}>
                      <Wind className={styles.detailIconSmall} />
                      <span>{weather.current.windSpeed} km/h</span>
                    </div>
                    <div className={styles.detailTourist}>
                      <CloudRain className={styles.detailIconSmall} />
                      <span>{weather.hourly?.[0]?.rain || 0}%</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Attractions Preview */}
              {location.location.attractions && (
                <div className={styles.attractionsPreview}>
                  <Camera className={styles.cameraIcon} />
                  <div className={styles.attractionsTags}>
                    {location.location.attractions
                      .slice(0, 3)
                      .map((attr, idx) => (
                        <span key={idx} className={styles.attractionTag}>
                          {attr}
                        </span>
                      ))}
                    {location.location.attractions.length > 3 && (
                      <span className={styles.moreTag}>
                        +{location.location.attractions.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className={styles.cardActionsBottom}>
                <button
                  className={styles.navigateBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    openGoogleMaps(
                      location.location.lat,
                      location.location.lon,
                      location.location.name
                    );
                  }}
                >
                  <Navigation className={styles.btnIcon} />
                  Chỉ đường
                </button>
                <button
                  className={styles.detailBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(location);
                  }}
                >
                  <ExternalLink className={styles.btnIcon} />
                  Chi tiết
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedLocation && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedLocation(null)}
        >
          <div
            className={styles.modalContentTourist}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Thêm hình ảnh modal */}
            {selectedLocation.location.image ? (
              <img
                src={selectedLocation.location.image}
                alt={selectedLocation.location.name}
                className={styles.modalImage}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={
                selectedLocation.location.image
                  ? styles.modalImagePlaceholder
                  : ""
              }
              style={{
                display: selectedLocation.location.image ? "none" : "flex",
              }}
            >
              <Camera className={styles.modalPlaceholderIcon} />
            </div>

            <button
              className={styles.modalClose}
              onClick={() => setSelectedLocation(null)}
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <div className={styles.modalHeaderTourist}>
              <div className={styles.modalTitleSection}>
                <h2 className={styles.modalTitleTourist}>
                  {selectedLocation.location.name}
                </h2>
                <div className={styles.modalBadges}>
                  <span className={styles.regionBadgeModal}>
                    {selectedLocation.location.region}
                  </span>
                  <div className={styles.ratingModal}>
                    <Star className={styles.starIconModal} />
                    <span>
                      {selectedLocation.location.rating || 4.5} (120 đánh giá)
                    </span>
                  </div>
                </div>
              </div>
              <p className={styles.modalDescription}>
                {selectedLocation.location.description}
              </p>
            </div>

            {/* Current Weather */}
            {weatherData[selectedLocation.location.id] && (
              <div className={styles.modalWeatherSection}>
                <h3 className={styles.sectionTitleTourist}>
                  <Sun className={styles.sectionIcon} />
                  Thời tiết hiện tại
                </h3>

                <div className={styles.weatherDisplayLarge}>
                  {React.createElement(
                    getWeatherIcon(
                      weatherData[selectedLocation.location.id].current.icon
                    ),
                    {
                      className: styles.weatherIconLarge,
                      style: {
                        color: getTemperatureColor(
                          weatherData[selectedLocation.location.id].current.temp
                        ),
                      },
                    }
                  )}
                  <div className={styles.weatherInfoLarge}>
                    <div
                      className={styles.tempLargeTourist}
                      style={{
                        color: getTemperatureColor(
                          weatherData[selectedLocation.location.id].current.temp
                        ),
                      }}
                    >
                      {weatherData[selectedLocation.location.id].current.temp}°C
                    </div>
                    <div className={styles.conditionLargeTourist}>
                      {
                        weatherData[selectedLocation.location.id].current
                          .condition
                      }
                    </div>
                    <div className={styles.feelsLikeTourist}>
                      Cảm giác như{" "}
                      {
                        weatherData[selectedLocation.location.id].current
                          .feelsLike
                      }
                      °C
                    </div>
                  </div>
                </div>

                <div className={styles.weatherGridModal}>
                  <div className={styles.weatherItemModal}>
                    <Droplets className={styles.itemIcon} />
                    <span className={styles.itemLabel}>Độ ẩm</span>
                    <span className={styles.itemValue}>
                      {
                        weatherData[selectedLocation.location.id].current
                          .humidity
                      }
                      %
                    </span>
                  </div>
                  <div className={styles.weatherItemModal}>
                    <Wind className={styles.itemIcon} />
                    <span className={styles.itemLabel}>Gió</span>
                    <span className={styles.itemValue}>
                      {
                        weatherData[selectedLocation.location.id].current
                          .windSpeed
                      }{" "}
                      km/h
                    </span>
                  </div>
                  <div className={styles.weatherItemModal}>
                    <CloudRain className={styles.itemIcon} />
                    <span className={styles.itemLabel}>Mưa</span>
                    <span className={styles.itemValue}>
                      {weatherData[selectedLocation.location.id].hourly[0]
                        ?.rain || 0}
                      %
                    </span>
                  </div>
                  <div className={styles.weatherItemModal}>
                    <Eye className={styles.itemIcon} />
                    <span className={styles.itemLabel}>Tầm nhìn</span>
                    <span className={styles.itemValue}>
                      {weatherData[selectedLocation.location.id].current
                        .visibility || "10"}{" "}
                      km
                    </span>
                  </div>
                </div>

                {/* Hourly Forecast */}
                <div className={styles.hourlyForecastModal}>
                  <h4 className={styles.forecastTitle}>
                    <Clock className={styles.forecastIcon} />
                    Dự báo 24 giờ tới
                  </h4>
                  <div className={styles.hourlyScroll}>
                    {weatherData[selectedLocation.location.id].hourly
                      .slice(0, 8)
                      .map((hour, idx) => (
                        <div key={idx} className={styles.hourlyItemTourist}>
                          <span className={styles.hourTime}>{hour.time}</span>
                          <span
                            className={styles.hourTemp}
                            style={{ color: getTemperatureColor(hour.temp) }}
                          >
                            {hour.temp}°
                          </span>
                          <div className={styles.hourRain}>
                            <Droplets className={styles.rainIconTiny} />
                            {hour.rain}%
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Attractions */}
            {selectedLocation.location.attractions && (
              <div className={styles.modalAttractions}>
                <h3 className={styles.sectionTitleTourist}>
                  <Camera className={styles.sectionIcon} />
                  Điểm tham quan nổi bật
                </h3>
                <div className={styles.attractionsGrid}>
                  {selectedLocation.location.attractions.map(
                    (attraction, idx) => (
                      <div key={idx} className={styles.attractionItem}>
                        <Camera className={styles.attractionIcon} />
                        <span>{attraction}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Best Time to Visit */}
            <div className={`${styles.visitInfo} ${styles.cardSciFi}`}>
              <h4>
                <Calendar className={styles.visitIcon} />
                Thời điểm lý tưởng để tham quan
              </h4>
              <p>
                <strong>Mùa khô (tháng 12 - tháng 4):</strong> Thời tiết nắng
                đẹp, thuận lợi cho du lịch sinh thái và tham quan ngoài trời.
                <br />
                <strong>Mùa mưa (tháng 5 - tháng 11):</strong> Cảnh quan xanh
                tươi, phù hợp cho trải nghiệm văn hóa địa phương.
              </p>
            </div>

            {/* Action Buttons */}
            <div className={styles.modalActionsTourist}>
              <button
                className={`${styles.actionBtnTourist} ${styles.primary}`}
                onClick={() =>
                  openGoogleMaps(
                    selectedLocation.location.lat,
                    selectedLocation.location.lon,
                    selectedLocation.location.name
                  )
                }
              >
                <Navigation />
                Chỉ đường đến đây
              </button>
              <button
                className={`${styles.actionBtnTourist} ${styles.secondary}`}
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
              <button
                className={`${styles.actionBtnTourist} ${styles.secondary}`}
                onClick={() => {
                  // Share functionality
                  navigator.share?.({
                    title: selectedLocation.location.name,
                    text: selectedLocation.location.description,
                    url: window.location.href,
                  });
                }}
              >
                <Share />
                Chia sẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
