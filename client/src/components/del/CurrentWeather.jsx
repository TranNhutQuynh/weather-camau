import React from 'react';
import { 
  Thermometer, Droplets, Wind, Eye, Sunrise, Sunset,
  Calendar, TrendingUp, CloudRain, Sun
} from 'lucide-react';
import styles from '../styles/CurrentWeather.module.css';

export default function CurrentWeather({ data }) {
  const { location, weather, forecast } = data;

  const todayForecast = forecast.list.slice(0, 8);
  const tomorrowForecast = forecast.list.slice(8, 16);

  const getDailyForecast = () => {
    const dailyData = {};
    
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('vi-VN');
      if (!dailyData[date]) {
        dailyData[date] = {
          temps: [],
          conditions: [],
          dt: item.dt,
          weather: item.weather[0]
        };
      }
      dailyData[date].temps.push(item.main.temp);
      dailyData[date].conditions.push(item.weather[0].description);
    });

    return Object.entries(dailyData).slice(0, 7).map(([date, data]) => ({
      date,
      day: new Date(data.dt * 1000).toLocaleDateString('vi-VN', { weekday: 'short' }),
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      condition: data.conditions[0],
      icon: data.weather.icon
    }));
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className={styles.currentWeatherSection}>
      {/* CURRENT WEATHER */}
      <div className={styles.currentNow}>
        <div className={styles.currentNowHeader}>
          <h3>Thời tiết hiện tại - {location.name}</h3>
          <span className={styles.updateTime}>
            Cập nhật: {new Date().toLocaleTimeString('vi-VN')}
          </span>
        </div>

        <div className={styles.currentNowGrid}>
          <div className={styles.currentTempBig}>
            <div className={styles.tempMain}>
              <span className={styles.tempNumber}>{Math.round(weather.main.temp)}°</span>
              <div className={styles.tempInfo}>
                <span className={styles.tempCondition}>{weather.weather[0].description}</span>
                <span className={styles.tempFeels}>
                  Cảm giác như {Math.round(weather.main.feels_like)}°
                </span>
              </div>
            </div>

            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
              className={styles.weatherIconLarge}
            />
          </div>

          <div className={styles.currentDetailsGrid}>
            <div className={styles.detailBox}>
              <Droplets className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Độ ẩm</span>
                <span className={styles.detailValue}>{weather.main.humidity}%</span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <Wind className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Gió</span>
                <span className={styles.detailValue}>
                  {Math.round(weather.wind.speed * 3.6)} km/h
                </span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <Eye className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Tầm nhìn</span>
                <span className={styles.detailValue}>
                  {(weather.visibility / 1000).toFixed(1)} km
                </span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <Thermometer className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Áp suất</span>
                <span className={styles.detailValue}>{weather.main.pressure} hPa</span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <Sunrise className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Bình minh</span>
                <span className={styles.detailValue}>
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            <div className={styles.detailBox}>
              <Sunset className={styles.detailIcon} />
              <div className={styles.detailContent}>
                <span className={styles.detailLabel}>Hoàng hôn</span>
                <span className={styles.detailValue}>
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TODAY FORECAST */}
      <div className={styles.forecastToday}>
        <h3 className={styles.forecastSectionTitle}>
          <Calendar className={styles.sectionIcon} />
          Dự báo hôm nay
        </h3>

        <div className={styles.forecastHourlyScroll}>
          {todayForecast.map((item, index) => (
            <div key={index} className={styles.forecastHourItem}>
              <span className={styles.hourTime}>
                {new Date(item.dt * 1000).toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>

              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                className={styles.hourIcon}
              />

              <span className={styles.hourTemp}>{Math.round(item.main.temp)}°</span>

              <div className={styles.hourRain}>
                <CloudRain className={styles.rainIcon} />
                <span>{Math.round(item.pop * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOMORROW */}
      <div className={styles.forecastTomorrow}>
        <h3 className={styles.forecastSectionTitle}>
          <TrendingUp className={styles.sectionIcon} />
          Dự báo ngày mai
        </h3>

        <div className={styles.forecastHourlyScroll}>
          {tomorrowForecast.map((item, index) => (
            <div key={index} className={styles.forecastHourItem}>
              <span className={styles.hourTime}>
                {new Date(item.dt * 1000).toLocaleTimeString('vi-VN', { 
                  hour: '2-digit', minute: '2-digit'
                })}
              </span>

              <img 
                src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                alt={item.weather[0].description}
                className={styles.hourIcon}
              />

              <span className={styles.hourTemp}>{Math.round(item.main.temp)}°</span>

              <div className={styles.hourRain}>
                <CloudRain className={styles.rainIcon} />
                <span>{Math.round(item.pop * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* WEEK FORECAST */}
      <div className={styles.forecastWeek}>
        <h3 className={styles.forecastSectionTitle}>
          <Sun className={styles.sectionIcon} />
          Dự báo 7 ngày
        </h3>

        <div className={styles.forecastDailyList}>
          {dailyForecast.map((day, index) => (
            <div key={index} className={styles.forecastDayItem}>
              <div className={styles.dayInfo}>
                <span className={styles.dayName}>
                  {index === 0 ? 'Hôm nay' : index === 1 ? 'Ngày mai' : day.day}
                </span>
                <span className={styles.dayDate}>{day.date}</span>
              </div>

              <div className={styles.dayWeather}>
                <img 
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.condition}
                  className={styles.dayIcon}
                />
                <span className={styles.dayCondition}>{day.condition}</span>
              </div>

              <div className={styles.dayTemps}>
                <span className={styles.tempHigh}>{day.high}°</span>

                <div className={styles.tempBar}>
                  <div className={styles.tempBarFill}></div>
                </div>

                <span className={styles.tempLow}>{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
