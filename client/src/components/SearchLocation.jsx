import React, { useState } from "react";
import { Search, MapPin, Navigation, Loader, X, ChevronRight } from "lucide-react";
import styles from "../styles/SearchLocation.module.css";

export default function SearchLocation({ onLocationSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE}/weather/search?q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm");
      }

      const data = await response.json();
      setResults(data);
      setShowResults(true);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
      setError("Không thể tìm kiếm địa điểm. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleSelectLocation = async (location) => {
    try {
      setLoading(true);

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(`${API_BASE}/weather/current/${location.lat}/${location.lon}`),
        fetch(`${API_BASE}/weather/forecast/${location.lat}/${location.lon}`)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error("Không thể lấy thời tiết");
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      if (onLocationSelect) {
        onLocationSelect({
          location,
          weather: weatherData,
          forecast: forecastData
        });
      }

      setQuery('');
      setShowResults(false);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi lấy thời tiết:", err);
      setError("Không thể lấy thông tin thời tiết");
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  return (
    <div className={styles["search-container-new"]}>
      <div className={styles["search-box-new"]}>
        <Search className={styles["search-icon-new"]} />
        <input
          type="text"
          className={styles["search-input-new"]}
          placeholder="Tìm kiếm: Hồng Dân, Bạc Liêu, Nam Căn..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {loading && <Loader className={styles["loading-icon-new"]} />}
        {query && !loading && (
          <button className={styles["clear-btn-new"]} onClick={clearSearch}>
            <X />
          </button>
        )}
      </div>

      {error && (
        <div className={styles["error-new"]}>
          <p>{error}</p>
        </div>
      )}

      {showResults && results.length > 0 && (
        <div className={styles["results-dropdown-new"]}>
          {results.map((result, index) => (
            <button
              key={index}
              className={styles["result-item-new"]}
              onClick={() => handleSelectLocation(result)}
            >
              <div className={styles["result-content-new"]}>
                <div className={styles["result-icon-wrapper"]}>
                  <MapPin className={styles["result-icon-new"]} />
                </div>
                <div className={styles["result-info-new"]}>
                  <div className={styles["result-name-new"]}>
                    {result.displayName || result.name}
                  </div>
                  {result.isLocal && (
                    <span className={styles["local-badge-new"]}>
                      Điểm du lịch
                    </span>
                  )}
                  <div className={styles["result-coords-new"]}>
                    {result.lat.toFixed(4)}, {result.lon.toFixed(4)}
                  </div>
                </div>
              </div>
              <ChevronRight className={styles["chevron-icon-new"]} />
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && query.length >= 2 && !loading && (
        <div className={styles["no-results-new"]}>
          <MapPin className={styles["no-results-icon-new"]} />
          <p>Không tìm thấy kết quả cho "{query}"</p>
        </div>
      )}

      <div className={styles["search-hints-new"]}>
        <div className={styles["hint-tags-new"]}>
          {["Hồng Dân", "Bạc Liêu", "Nam Căn", "U Minh", "Đầm Dơi"].map(
            (hint) => (
              <button
                key={hint}
                className={styles["hint-tag-new"]}
                onClick={() => {
                  setQuery(hint);
                  handleSearch(hint);
                }}
              >
                {hint}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
