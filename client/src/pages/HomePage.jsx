import React, { useState, useEffect } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Sunrise,
  Sunset,
  MapPin,
  Navigation,
  Compass,
  CloudSun,
  Umbrella
} from "lucide-react";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [weeklyForecast, setWeeklyForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("today"); // 'today', 'hourly', 'weekly'

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const lat = 9.1526;
      const lon = 105.196;

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${API_BASE}/weather/current/${lat}/${lon}`),
        fetch(`${API_BASE}/weather/forecast/${lat}/${lon}`),
      ]);

      const current = await currentRes.json();
      const forecast = await forecastRes.json();

      setCurrentWeather(current);
      setHourlyForecast(forecast.list.slice(0, 12));
      
      const daily = groupByDay(forecast.list);
      setWeeklyForecast(daily.slice(0, 7));

      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  const groupByDay = (forecastList) => {
    const dailyData = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("vi-VN");
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          rain: [],
          dt: item.dt,
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0]);
      dailyData[date].rain.push(item.pop);
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      day: new Date(data.dt * 1000).toLocaleDateString("vi-VN", {
        weekday: "long",
      }),
      dayShort: new Date(data.dt * 1000).toLocaleDateString("vi-VN", {
        weekday: "short",
      }),
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      condition: data.conditions[0].description,
      icon: data.conditions[0].icon,
      rain: Math.round(Math.max(...data.rain) * 100),
    }));
  };

  const getWeatherIcon = (iconCode) => {
    if (iconCode?.includes("01")) return Sun;
    if (iconCode?.includes("02")) return CloudSun;
    if (iconCode?.includes("03") || iconCode?.includes("04")) return Cloud;
    if (iconCode?.includes("09") || iconCode?.includes("10") || iconCode?.includes("11")) return CloudRain;
    return Sun;
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return "#ef476f";
    if (temp >= 30) return "#ff9f1c";
    if (temp >= 25) return "#ffbf69";
    return "#06ffa5";
  };

  const getUVIndexLevel = (uvi) => {
    if (uvi <= 2) return { level: "Thấp", color: "#06ffa5" };
    if (uvi <= 5) return { level: "Trung bình", color: "#ffbf69" };
    if (uvi <= 7) return { level: "Cao", color: "#ff9f1c" };
    if (uvi <= 10) return { level: "Rất cao", color: "#ef476f" };
    return { level: "Cực cao", color: "#7b2cbf" };
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Đang tải dữ liệu thời tiết...</p>
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      {/* Hero Weather Card */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} />
        
        <div className={styles.heroHeader}>
          <div className={styles.locationInfo}>
            <div className={styles.locationHeader}>
              <MapPin className={styles.locationIcon} />
              <h1 className={styles.locationName}>Cà Mau</h1>
            </div>
            <p className={styles.locationDesc}>Tỉnh cực Nam Việt Nam</p>
            <p className={styles.currentTime}>
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className={styles.weatherQuickStats}>
            <div className={styles.quickStat}>
              <Umbrella className={styles.quickStatIcon} />
              <span>30%</span>
            </div>
            <div className={styles.quickStat}>
              <Compass className={styles.quickStatIcon} />
              <span>Đông Nam</span>
            </div>
            <div className={styles.quickStat}>
              <Gauge className={styles.quickStatIcon} />
              <span>1013 hPa</span>
            </div>
          </div>
        </div>

        {currentWeather && (
          <div className={styles.currentWeatherDisplay}>
            <div className={styles.tempSection}>
              <div className={styles.tempMain}>
                <span 
                  className={styles.tempValue}
                  style={{ color: getTemperatureColor(currentWeather.main.temp) }}
                >
                  {Math.round(currentWeather.main.temp)}°
                </span>
                <span className={styles.tempUnit}>C</span>
              </div>
              <div className={styles.weatherDesc}>
                <p className={styles.conditionMain}>
                  {currentWeather.weather[0].description}
                </p>
                <p className={styles.feelsLike}>
                  Cảm giác như {Math.round(currentWeather.main.feels_like)}°C
                </p>
              </div>
            </div>

            <div className={styles.weatherIconSection}>
              {React.createElement(
                getWeatherIcon(currentWeather.weather[0].icon),
                { className: styles.weatherIconLarge }
              )}
            </div>
          </div>
        )}

        {/* Weather Details Grid */}
        {currentWeather && (
          <div className={styles.weatherDetailsGrid}>
            <div className={styles.detailCard}>
              <Droplets className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <p className={styles.detailLabel}>Độ ẩm</p>
                <p className={styles.detailValue}>{currentWeather.main.humidity}%</p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <Wind className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <p className={styles.detailLabel}>Gió</p>
                <p className={styles.detailValue}>
                  {Math.round(currentWeather.wind.speed * 3.6)} km/h
                </p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <Eye className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <p className={styles.detailLabel}>Tầm nhìn</p>
                <p className={styles.detailValue}>
                  {Math.round(currentWeather.visibility / 1000)} km
                </p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <Gauge className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <p className={styles.detailLabel}>Áp suất</p>
                <p className={styles.detailValue}>
                  {currentWeather.main.pressure} hPa
                </p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <Sunrise className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <p className={styles.detailLabel}>Bình minh</p>
                <p className={styles.detailValue}>
                  {new Date(
                    currentWeather.sys.sunrise * 1000
                  ).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className={styles.detailCard}>
              <Sunset className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <p className={styles.detailLabel}>Hoàng hôn</p>
                <p className={styles.detailValue}>
                  {new Date(
                    currentWeather.sys.sunset * 1000
                  ).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Forecast Navigation Tabs */}
      <div className={styles.forecastTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === "today" ? styles.active : ""}`}
          onClick={() => setActiveTab("today")}
        >
          <Sun className={styles.tabIcon} />
          Hôm nay
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === "hourly" ? styles.active : ""}`}
          onClick={() => setActiveTab("hourly")}
        >
          <Calendar className={styles.tabIcon} />
          Theo giờ
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === "weekly" ? styles.active : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          <TrendingUp className={styles.tabIcon} />
          7 ngày
        </button>
      </div>

      {/* Hourly Forecast */}
      {activeTab === "hourly" && (
        <section className={styles.forecastSection}>
          <h2 className={styles.sectionTitle}>
            <Calendar className={styles.titleIcon} />
            Dự báo 12 giờ tới
          </h2>
          <div className={styles.hourlyScroll}>
            {hourlyForecast.map((hour, index) => {
              const HourIcon = getWeatherIcon(hour.weather[0].icon);
              return (
                <div key={index} className={`${styles.hourlyCard} ${styles.cardSciFi}`}>
                  <p className={styles.hourlyTime}>
                    {new Date(hour.dt * 1000).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                    })}
                  </p>
                  <HourIcon 
                    className={styles.hourlyIcon}
                    style={{ color: getTemperatureColor(hour.main.temp) }}
                  />
                  <p 
                    className={styles.hourlyTemp}
                    style={{ color: getTemperatureColor(hour.main.temp) }}
                  >
                    {Math.round(hour.main.temp)}°
                  </p>
                  <div className={styles.rainChance}>
                    <Droplets className={styles.rainIcon} />
                    <span>{Math.round(hour.pop * 100)}%</span>
                  </div>
                  <div className={styles.humidityInfo}>
                    <span>{hour.main.humidity}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 7-Day Forecast */}
      {activeTab === "weekly" && (
        <section className={styles.weeklySection}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp className={styles.titleIcon} />
            Dự báo 7 ngày tới
          </h2>
          <div className={styles.weeklyGrid}>
            {weeklyForecast.map((day, index) => {
              const DayIcon = getWeatherIcon(day.icon);
              const isToday = index === 0;
              
              return (
                <div key={index} className={`${styles.weeklyCard} ${styles.cardSciFi} ${isToday ? styles.today : ''}`}>
                  <div className={styles.weeklyHeader}>
                    <h3 className={styles.weeklyDay}>{isToday ? "Hôm nay" : day.dayShort}</h3>
                    <p className={styles.weeklyDate}>{day.date}</p>
                  </div>
                  <DayIcon 
                    className={styles.weeklyIcon}
                    style={{ color: getTemperatureColor(day.high) }}
                  />
                  <p className={styles.weeklyCondition}>{day.condition}</p>
                  <div className={styles.weeklyTemp}>
                    <span className={styles.tempHigh}>{day.high}°</span>
                    <span className={styles.tempDivider}>/</span>
                    <span className={styles.tempLow}>{day.low}°</span>
                  </div>
                  <div className={styles.rainChance}>
                    <Droplets className={styles.rainIcon} />
                    <span>{day.rain}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Today's Highlights */}
      {activeTab === "today" && currentWeather && (
        <section className={styles.highlightsSection}>
          <h2 className={styles.sectionTitle}>
            <TrendingUp className={styles.titleIcon} />
            Chỉ số nổi bật hôm nay
          </h2>
          <div className={styles.highlightsGrid}>
            <div className={`${styles.highlightCard} ${styles.cardSciFi}`}>
              <div className={styles.highlightHeader}>
                <Sun className={styles.highlightIcon} />
                <span className={styles.highlightTitle}>Chỉ số UV</span>
              </div>
              <div className={styles.highlightValue}>
                <span 
                  className={styles.uvValue}
                  style={{ color: getUVIndexLevel(6).color }}
                >
                  6
                </span>
                <span className={styles.uvLevel}>{getUVIndexLevel(6).level}</span>
              </div>
              <div className={styles.highlightProgress}>
                <div 
                  className={styles.progressBar}
                  style={{ 
                    width: '60%',
                    background: getUVIndexLevel(6).color 
                  }}
                />
              </div>
            </div>

            <div className={`${styles.highlightCard} ${styles.cardSciFi}`}>
              <div className={styles.highlightHeader}>
                <Eye className={styles.highlightIcon} />
                <span className={styles.highlightTitle}>Chất lượng không khí</span>
              </div>
              <div className={styles.highlightValue}>
                <span className={styles.aqiValue}>Tốt</span>
                <span className={styles.aqiIndex}>32 AQI</span>
              </div>
              <div className={styles.aqiDescription}>
                Chất lượng không khí tốt, phù hợp cho các hoạt động ngoài trời
              </div>
            </div>

            <div className={`${styles.highlightCard} ${styles.cardSciFi}`}>
              <div className={styles.highlightHeader}>
                <CloudRain className={styles.highlightIcon} />
                <span className={styles.highlightTitle}>Lượng mưa</span>
              </div>
              <div className={styles.highlightValue}>
                <span className={styles.rainValue}>2.4mm</span>
                <span className={styles.rainProbability}>30% có mưa</span>
              </div>
              <div className={styles.rainDescription}>
                Mưa nhẹ rải rác trong ngày
              </div>
            </div>

            <div className={`${styles.highlightCard} ${styles.cardSciFi}`}>
              <div className={styles.highlightHeader}>
                <Wind className={styles.highlightIcon} />
                <span className={styles.highlightTitle}>Hướng gió</span>
              </div>
              <div className={styles.highlightValue}>
                <Compass 
                  className={styles.windCompass}
                  style={{ transform: `rotate(${currentWeather.wind.deg}deg)` }}
                />
                <span className={styles.windDirection}>Đông Nam</span>
              </div>
              <div className={styles.windSpeed}>
                {Math.round(currentWeather.wind.speed * 3.6)} km/h
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Weather Alerts */}
      <section className={styles.alertsSection}>
        <h2 className={styles.sectionTitle}>
          <AlertTriangle className={styles.titleIcon} />
          Cảnh báo thời tiết
        </h2>
        <div className={`${styles.alertCard} ${styles.warning} ${styles.cardSciFi}`}>
          <AlertTriangle className={styles.alertIcon} />
          <div className={styles.alertContent}>
            <h3 className={styles.alertTitle}>Cảnh báo nhiệt độ cao</h3>
            <p className={styles.alertMessage}>
              Nhiệt độ có thể lên tới 35°C vào buổi trưa. Hạn chế hoạt động ngoài trời 
              từ 11:00 - 15:00. Uống đủ nước và sử dụng kem chống nắng.
            </p>
            <span className={styles.alertTime}>
              Cập nhật: {new Date().toLocaleTimeString("vi-VN")}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}