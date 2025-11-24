import React, { useState } from "react";
import {
  MapPin,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import TouristWeather from "./TouristWeather";
import RegionalWeatherStats from "./RegionalWeatherStats";
import WeatherMap from "./WeatherMap";
import styles from "../styles/Content.module.css";

export default function Content() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentWeather = {
    temp: 32,
    condition: "Nắng gián đoạn",
    feelsLike: 35,
    humidity: 75,
    windSpeed: 15,
    visibility: 10,
    pressure: 1012,
    uvIndex: 8,
    icon: Sun,
  };

  const hourlyForecast = [
    { time: "14:00", temp: 32, icon: Sun, rain: 10 },
    { time: "15:00", temp: 33, icon: Sun, rain: 5 },
    { time: "16:00", temp: 32, icon: Cloud, rain: 20 },
    { time: "17:00", temp: 30, icon: CloudRain, rain: 60 },
    { time: "18:00", temp: 29, icon: CloudRain, rain: 70 },
    { time: "19:00", temp: 28, icon: Cloud, rain: 40 },
    { time: "20:00", temp: 27, icon: Cloud, rain: 30 },
    { time: "21:00", temp: 27, icon: Cloud, rain: 20 },
  ];

  const weeklyForecast = [
    {
      day: "Hôm nay",
      date: "28/10",
      high: 33,
      low: 26,
      icon: Sun,
      condition: "Nắng",
      rain: 10,
    },
    {
      day: "Thứ 4",
      date: "29/10",
      high: 32,
      low: 25,
      icon: CloudRain,
      condition: "Mưa rào",
      rain: 70,
    },
    {
      day: "Thứ 5",
      date: "30/10",
      high: 31,
      low: 24,
      icon: CloudRain,
      condition: "Mưa",
      rain: 80,
    },
    {
      day: "Thứ 6",
      date: "31/10",
      high: 30,
      low: 24,
      icon: Cloud,
      condition: "Nhiều mây",
      rain: 40,
    },
    {
      day: "Thứ 7",
      date: "01/11",
      high: 31,
      low: 25,
      icon: Sun,
      condition: "Nắng nhẹ",
      rain: 20,
    },
    {
      day: "CN",
      date: "02/11",
      high: 32,
      low: 26,
      icon: Sun,
      condition: "Nắng",
      rain: 10,
    },
    {
      day: "Thứ 2",
      date: "03/11",
      high: 33,
      low: 26,
      icon: Sun,
      condition: "Nắng",
      rain: 5,
    },
  ];

  const weatherAlerts = [
    {
      type: "warning",
      title: "Cảnh báo nhiệt độ cao",
      message: "Nhiệt độ có thể lên tới 35°C. Hạn chế hoạt động ngoài trời.",
      time: "10:30",
    },
    {
      type: "info",
      title: "Dự báo mưa chiều tối",
      message: "Khả năng mưa rào và dông từ 17:00 - 20:00.",
      time: "09:15",
    },
  ];

  return (
    <main className={`${styles.main} ${isDarkMode ? styles.dark : ""}`}>
      <div className={styles.container}>
        {/* Cảnh báo thời tiết */}
        <section className={styles.alertsSection} id="canh-bao">
          {weatherAlerts.map((alert, index) => (
            <div
              key={index}
              className={`${styles.alert} ${styles[alert.type]}`}
            >
              <AlertTriangle className={styles.alertIcon} />
              <div className={styles.alertContent}>
                <h3 className={styles.alertTitle}>{alert.title}</h3>
                <p className={styles.alertMessage}>{alert.message}</p>
                <span className={styles.alertTime}>{alert.time}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Thời tiết hiện tại */}
        <section className={styles.currentSection} id="hien-tai">
          <div className={styles.currentCard}>
            <div className={styles.currentMain}>
              <div className={styles.tempDisplay}>
                <currentWeather.icon className={styles.weatherIcon} />
                <div>
                  <h2 className={styles.currentTemp}>
                    {currentWeather.temp}°C
                  </h2>
                  <p className={styles.condition}>{currentWeather.condition}</p>
                  <p className={styles.feelsLike}>
                    Cảm giác như {currentWeather.feelsLike}°C
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.weatherDetails}>
              <div className={styles.detailItem}>
                <Droplets className={styles.detailIcon} />
                <div>
                  <p className={styles.detailLabel}>Độ ẩm</p>
                  <p className={styles.detailValue}>
                    {currentWeather.humidity}%
                  </p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Wind className={styles.detailIcon} />
                <div>
                  <p className={styles.detailLabel}>Gió</p>
                  <p className={styles.detailValue}>
                    {currentWeather.windSpeed} km/h
                  </p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Eye className={styles.detailIcon} />
                <div>
                  <p className={styles.detailLabel}>Tầm nhìn</p>
                  <p className={styles.detailValue}>
                    {currentWeather.visibility} km
                  </p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Gauge className={styles.detailIcon} />
                <div>
                  <p className={styles.detailLabel}>Áp suất</p>
                  <p className={styles.detailValue}>
                    {currentWeather.pressure} mb
                  </p>
                </div>
              </div>
              <div className={styles.detailItem}>
                <Sun className={styles.detailIcon} />
                <div>
                  <p className={styles.detailLabel}>Chỉ số UV</p>
                  <p className={styles.detailValue}>
                    {currentWeather.uvIndex}/10
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dự báo theo giờ */}
        <section className={styles.hourlySection} id="theo-gio">
          <h2 className={styles.sectionTitle}>
            <Calendar className={styles.titleIcon} />
            Dự báo theo giờ
          </h2>
          <div className={styles.hourlyScroll}>
            {hourlyForecast.map((hour, index) => (
              <div key={index} className={styles.hourlyCard}>
                <p className={styles.hourlyTime}>{hour.time}</p>
                <hour.icon className={styles.hourlyIcon} />
                <p className={styles.hourlyTemp}>{hour.temp}°</p>
                <div className={styles.rainChance}>
                  <Droplets className={styles.rainIcon} />
                  <span>{hour.rain}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dự báo 7 ngày */}
        <section className={styles.weeklySection} id="7-ngay">
          <h2 className={styles.sectionTitle}>
            <TrendingUp className={styles.titleIcon} />
            Dự báo 7 ngày tới
          </h2>
          <div className={styles.weeklyGrid}>
            {weeklyForecast.map((day, index) => (
              <div key={index} className={styles.weeklyCard}>
                <div className={styles.weeklyHeader}>
                  <h3 className={styles.weeklyDay}>{day.day}</h3>
                  <p className={styles.weeklyDate}>{day.date}</p>
                </div>
                <day.icon className={styles.weeklyIcon} />
                <p className={styles.weeklyCondition}>{day.condition}</p>
                <div className={styles.weeklyTemp}>
                  <span className={styles.tempHigh}>{day.high}°</span>
                  <span className={styles.tempLow}>{day.low}°</span>
                </div>
                <div className={styles.rainChance}>
                  <Droplets className={styles.rainIcon} />
                  <span>{day.rain}%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PHẦN MỚI: Thống kê theo khu vực */}
        <RegionalWeatherStats />

        {/* PHẦN MỚI: Thời tiết điểm du lịch */}
        <TouristWeather />

        {/* Bản đồ radar */}
        <section className={styles.radarSection} id="ban-do">
          <h2 className={styles.sectionTitle}>
            <MapPin className={styles.titleIcon} />
            Bản đồ radar thời tiết
          </h2>
          <div className={styles.radarCard}>
            <div className={styles.radarPlaceholder}>
              <MapPin className={styles.radarIcon} />
              <p>Bản đồ radar thời tiết Cà Mau</p>
              <span className={styles.radarNote}>
                Tích hợp Google Maps API hoặc OpenWeatherMap
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
