import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Thermometer,
  Droplets,
  Sun,
  CloudRain,
  Calendar,
  Info,
} from "lucide-react";
import styles from "../styles/WeatherTrends.module.css"; // Bạn tạo file CSS này tương tự các file khác

export default function WeatherTrends() {
  const monthlyData = [
    { month: "Th1", temp: 26.5, rain: 25 },
    { month: "Th2", temp: 27.2, rain: 15 },
    { month: "Th3", temp: 28.4, rain: 35 },
    { month: "Th4", temp: 29.8, rain: 110 },
    { month: "Th5", temp: 29.2, rain: 320 },
    { month: "Th6", temp: 28.7, rain: 420 },
    { month: "Th7", temp: 28.3, rain: 480 },
    { month: "Th8", temp: 28.1, rain: 520 },
    { month: "Th9", temp: 28.0, rain: 510 },
    { month: "Th10", temp: 28.2, rain: 430 },
    { month: "Th11", temp: 27.8, rain: 240 },
    { month: "Th12", temp: 26.8, rain: 60 },
  ];

  const maxRain = Math.max(...monthlyData.map((d) => d.maxRain));

  return (
    <div className={styles.trendsPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Xu hướng & Thống kê thời tiết</h1>
          <p className={styles.pageSubtitle}>
            Cà Mau • Bạc Liêu (cũ) • Dữ liệu trung bình nhiều năm
          </p>
        </div>
        <TrendingUp className={styles.headerIcon} size={80} />
      </div>

      {/* Tổng quan card */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.cardSciFi}`}>
          <Thermometer className={styles.statIcon} />
          <div>
            <p className={styles.statLabel}>Nhiệt độ trung bình năm</p>
            <p className={styles.statValue}>27.9°C</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.cardSciFi}`}>
          <Droplets className={styles.statIcon} />
          <div>
            <p className={styles.statLabel}>Lượng mưa trung bình năm</p>
            <p className={styles.statValue}>~2.350 mm</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.cardSciFi}`}>
          <Sun className={styles.statIcon} />
          <div>
            <p className={styles.statLabel}>Mùa khô</p>
            <p className={styles.statValue}>Tháng 12 – Tháng 4</p>
          </div>
        </div>
        <div className={`${styles.statCard} ${styles.cardSciFi}`}>
          <CloudRain className={styles.statIcon} />
          <div>
            <p className={styles.statLabel}>Mùa mưa</p>
            <p className={styles.statValue}>Tháng 5 – Tháng 11</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ lượng mưa */}
      <div className={`${styles.chartSection} ${styles.cardSciFi}`}>
        <h2 className={styles.sectionTitle}>
          <Droplets className={styles.titleIcon} />
          Lượng mưa trung bình theo tháng (mm)
        </h2>
        <div className={styles.barChart}>
          {monthlyData.map((item) => (
            <div key={item.month} className={styles.barItem}>
              <div
                className={styles.bar}
                style={{ height: `${(item.rain / maxRain) * 100}%` }}
              >
                <span className={styles.barLabel}>{item.rain}</span>
              </div>
              <span className={styles.monthLabel}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Biểu đồ nhiệt độ */}
      <div className={`${styles.chartSection} ${styles.cardSciFi}`}>
        <h2 className={styles.sectionTitle}>
          <Thermometer className={styles.titleIcon} />
          Nhiệt độ trung bình theo tháng (°C)
        </h2>
        <div className={styles.tempChart}>
          {monthlyData.map((item) => (
            <div key={item.month} className={styles.tempItem}>
              <span className={styles.tempValue}>{item.temp}°</span>
              <div
                className={styles.tempBar}
                style={{
                  background: `linear-gradient(to top, #ff9f1c ${(item.temp - 25) * 10}%, #06ffa5 0%)`,
                }}
              ></div>
              <span className={styles.monthLabel}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lưu ý du lịch */}
      <div className={`${styles.infoBanner} ${styles.cardSciFi}`}>
        <Info className={styles.bannerIcon} />
        <div className={styles.bannerContent}>
          <h3>💡 Khuyến cáo du lịch theo mùa</h3>
          <ul>
            <li>
              <strong>Tháng 12 – 4 (mùa khô):</strong> Thời tiết đẹp nhất, lý tưởng cho Mũi Cà Mau, Hòn Khoai, điện gió Bạc Liêu, Nhà Công tử Bạc Liêu.
            </li>
            <li>
              <strong>Tháng 5 – 11 (mùa mưa):</strong> Rừng tràm Trà Sư, U Minh Hạ rất đẹp, xanh mướt, nhưng cần áo mưa, ủng đi rừng.
            </li>
            <li>
              Tránh đi Mũi Cà Mau vào ngày triều cường mạnh (tháng 8–10 âm lịch).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}