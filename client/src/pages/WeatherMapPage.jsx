import React from "react";
import { Map, Wind, CloudRain, Thermometer } from "lucide-react";
import styles from "../styles/WeatherMapPage.module.css"; // Tạo file CSS tương tự

export default function WeatherMapPage() {
  return (
    <div className={styles.mapPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Bản đồ thời tiết tương tác</h1>
          <p className={styles.pageSubtitle}>
            Toàn vùng Cà Mau & Bạc Liêu cũ • Windy.com
          </p>
        </div>
        <Map className={styles.headerIcon} size={80} />
      </div>

      {/* Bản đồ thời tiết chi tiết (gió, mưa, mây, nhiệt độ, radar...)</h3>

      {/* Windy.com Embed - đã căn giữa Cà Mau, zoom phù hợp */}
      <div className={styles.mapContainer}>
        <iframe
          width="100%"
          height="750"
          src="https://embed.windy.com/embed2.html?lat=9.000&lon=105.150&detailLat=9.178&detailLon=105.151&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1"
          frameBorder="0"
          title="Bản đồ thời tiết Windy"
        ></iframe>
      </div>

      {/* Hướng dẫn sử dụng */}
      <div className={`${styles.guideCard} ${styles.cardSciFi}`}>
        <h3>🖱️ Hướng dẫn sử dụng bản đồ</h3>
        <ul>
          <li>Click chuột phải + kéo để xem dự báo giờ</li>
          <li>Chọn lớp phủ (overlay): Rain, Wind, Temperature, Clouds, Radar...</li>
          <li>Click vào bất kỳ điểm nào → xem chi tiết thời tiết 10 ngày</li>
          <li>Dùng bánh xe chuột để zoom, kéo để di chuyển</li>
        </ul>
      </div>

      {/* Các lớp phủ nhanh */}
      <div className={styles.quickLinks}>
        <a
          href="https://embed.windy.com/embed2.html?lat=9&lon=105.15&zoom=8&overlay=rain"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quickLink}
        >
          <CloudRain /> Xem mưa & radar
        </a>
        <a
          href="https://embed.windy.com/embed2.html?lat=9&lon=105.15&zoom=8&overlay=wind"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quickLink}
        >
          <Wind /> Xem gió
        </a>
        <a
          href="https://embed.windy.com/embed2.html?lat=9&lon=105.15&zoom=8&overlay=temp"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quickLink}
        >
          <Thermometer /> Xem nhiệt độ
        </a>
      </div>
    </div>
  );
}