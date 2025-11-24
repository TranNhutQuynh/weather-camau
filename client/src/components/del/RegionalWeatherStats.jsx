import { useState, useEffect } from "react";
import {
  MapPin,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react";
import styles from "../styles/RegionalStats.module.css";


const RegionalStats = () => {
  // stats:thống kê
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchRegionalStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/weather/tourist-all`);
      const data = await response.json();

      // Tính toán thống kê
      const validData = data.filter((item) => !item.error && item.weather);

      const caMauData = validData.filter(
        (item) => item.location.region === "Cà mau"
      );
      const bacLieuData = validData.filter(
        (item) => item.location.region === "Bạc Liêu"
      );

      const calculateStats = (regionData) => {
        if (regionData === 0) return null;
        const temps = regionData.map((item) => item.weather.current.temps);
        const humidity = regionData.map(
          (item) => item.weather.current.humidity
        );
        const windSpeed = regionData.map(
          (item) => item.weather.current.windSpeed
        );

        return {
          avgTemps: Math.round(temps.reduce((a, b) => a + b, 0) / temps.length),
          maxTemps: Math.max(...temps),
          minTemps: Math.min(...temps),
          avgHumidity: Math.round(
            humidity.reduce((a, b) => a + b, 0) / humidity.length
          ),
          avgWind: Math.round(
            windSpeed.reduce((a, b) => a + b, 0) / windSpeed.length
          ),
          // Số lượng địa điểm
          locationCount: regionData.length,
        };
      };
      setStats({
        caMau: calculateStats(caMauData),
        bacLieu: calculateStats(bacLieuData),
        total: calculateStats(validData),
      });
      setLoading(false);
    } catch (error) {
      console.error("Lỗi lấy thống kê.", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRegionalStats();
  }, []);

  if (loading || !stats) return null;

  const StatCard = ({ title, data, color }) => (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statHeader}>
        <MapPin className={styles.statIcon} style={{ color }} />
        <h3 className={styles.statTitle}>{title}</h3>
        <span className={styles.locationCount}>{data.locationCount} điểm</span>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statItem}>
          <Thermometer className={styles.itemIcon} />
          <div>
            <p className={styles.itemLabel}>Nhiệt độ trung bình</p>
            <p className={styles.itemValue}>{data.avgTemps}°C</p>
            {/* một dải các mục hoặc giá trị trong một tập hợp dữ liệu cụ thể.  */}
            <p className={styles.itemRange}>
              <TrendingDown className={styles.rangeIcon} />
              {data.minTemps}° - {data.maxTemps}°
              <TrendingUp className={styles.rangeIcon} />
            </p>
          </div>
        </div>
        <div className={styles.statItem}>
          <Droplets className={styles.itemIcon} />
          <div>
            <p className={styles.itemLabel}>Độ ẩm TB</p>
            <p className={styles.itemValue}>{data.avgHumidity}%</p>
          </div>
        </div>

        <div className={styles.statItem}>
          <Wind className={styles.itemIcon} />
          <div>
            <p className={styles.itemLabel}>Gió TB</p>
            <p className={styles.itemValue}>{data.avgWind} km/h</p>
          </div>
        </div>
      </div>
    </div>
  );
  return ( <section className={styles.statsSection}>
    <h2 className={styles.sectionTitle}>
      <Activity className={styles.titleIcon} />
      Thống kê thời tiết theo khu vực
    </h2>

    <div className={styles.statsGrid}>
      <StatCard 
        title="Toàn tỉnh Cà Mau" 
        data={stats.total}
        color="#3b82f6"
      />
      
      {stats.caMau && (
        <StatCard 
          title="Khu vực Cà Mau" 
          data={stats.caMau}
          color="#10b981"
        />
      )}
      
      {stats.bacLieu && (
        <StatCard 
          title="Khu vực Bạc Liêu (cũ)" 
          data={stats.bacLieu}
          color="#f59e0b"
        />
      )}
    </div>

    <div className={styles.infoBox}>
      <Sun className={styles.infoIcon} />
      <div>
        <h4 className={styles.infoTitle}>Về tỉnh Cà Mau mới</h4>
        <p className={styles.infoText}>
          Sau khi sáp nhập với tỉnh Bạc Liêu, Cà Mau trở thành tỉnh lớn nhất 
          vùng Đồng bằng sông Cửu Long với {stats.total.locationCount} điểm du lịch nổi bật. 
          Khí hậu nhiệt đới gió mùa, ấm áp quanh năm, thuận lợi cho du lịch sinh thái.
        </p>
      </div>
    </div>

    <div className={styles.comparisonNote}>
      <p>
        <strong>Khu vực Cà Mau cũ:</strong> Đặc trưng với rừng tràm, rừng ngập mặn, 
        điểm cực Nam - nhiệt độ trung bình {stats.caMau?.avgTemp}°C
      </p>
      <p>
        <strong>Khu vực Bạc Liêu cũ:</strong> Nổi tiếng với di tích văn hóa, 
        công viên điện gió - nhiệt độ trung bình {stats.bacLieu?.avgTemp}°C
      </p>
    </div>
  </section>);
};
export default RegionalStats;
