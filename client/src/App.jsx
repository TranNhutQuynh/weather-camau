import React, { useState } from "react";
import { Home, MapPin, Compass, TrendingUp, Map, Menu, X } from "lucide-react";
import HomePage from "./pages/HomePage";
import DistrictWeather from "./pages/DistrictWeather";
import TouristLocations from "./pages/TouristLocations";
import WeatherTrends from "./pages/WeatherTrends";
import WeatherMapPage from "./pages/WeatherMapPage";
import SearchLocation from "./components/SearchLocation";
import "./App.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "home", name: "Trang chủ", icon: Home },
    { id: "districts", name: "Thời tiết các huyện", icon: MapPin },
    { id: "tourist", name: "Điểm du lịch", icon: Compass },
    { id: "trends", name: "Xu hướng & Thống kê", icon: TrendingUp },
    { id: "map", name: "Bản đồ thời tiết", icon: Map },
  ];

  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData);
    setCurrentPage("districts");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "districts":
        return <DistrictWeather selectedLocation={selectedLocation} />;
      case "tourist":
        return <TouristLocations />;
      case "trends":
        return <WeatherTrends />;
      case "map":
        return <WeatherMapPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${mobileMenuOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">☁️</div>
            <div className="logo-text">
              <h1>Cà Mau Weather</h1>
              <p>Dự báo thời tiết thông minh</p>
            </div>
          </div>
          <button 
            className="mobile-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <SearchLocation onLocationSelect={handleLocationSelect} />
        </div>

        {/* Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? "active" : ""}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
                <div className="nav-indicator" />
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="weather-info-mini">
            <div className="mini-temp">32°C</div>
            <div className="mini-location">Cà Mau</div>
          </div>
          <p className="copyright">© 2024 Cà Mau Weather</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu />
        </button>

        <div className="page-transition">
          {renderPage()}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div 
          className="backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}