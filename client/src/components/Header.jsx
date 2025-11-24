import React, { useState } from 'react';
import { Cloud, MapPin, Search, Menu, X, Sun, Moon, Bell } from 'lucide-react';
import styles from '../styles/Header.module.css';

export default function WeatherHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Tìm kiếm:', searchQuery);
      // Xử lý tìm kiếm địa điểm
    }
  };

  const handleSearchInput = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Xử lý chuyển đổi dark mode cho toàn bộ app
  };

  const notifications = [
    { id: 1, title: 'Cảnh báo mưa lớn', time: '10 phút trước' },
    { id: 2, title: 'Nhiệt độ tăng cao', time: '1 giờ trước' }
  ];

  return (
    <header className={`${styles.header} ${isDarkMode ? styles.dark : ''}`}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          {/* Logo và tên */}
          <div className={styles.logo}>
            <Cloud className={styles.logoIcon} />
            <div>
              <h1 className={styles.title}>Thời Tiết Bạc Liêu</h1>
              <div className={styles.location}>
                <MapPin className={styles.locationIcon} />
                <span>Tỉnh Bạc Liêu, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Thanh tìm kiếm (Desktop) */}
          <div className={`${styles.searchBox} ${styles.desktop}`}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchInput}
              className={styles.searchInput}
            />
          </div>

          {/* Menu chức năng */}
          <div className={styles.actions}>
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className={`${styles.actionBtn} ${styles.desktop}`}
              title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
            >
              {isDarkMode ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
            </button>

            {/* Thông báo */}
            <div className={styles.notificationWrapper}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`${styles.actionBtn} ${styles.desktop}`}
                title="Thông báo"
              >
                <Bell className={styles.icon} />
                {notifications.length > 0 && (
                  <span className={styles.badge}></span>
                )}
              </button>

              {/* Dropdown thông báo */}
              {showNotifications && (
                <div className={`${styles.notificationDropdown} ${isDarkMode ? styles.dropdownDark : ''}`}>
                  <div className={styles.notificationHeader}>
                    <h3>Thông báo</h3>
                  </div>
                  <div className={styles.notificationList}>
                    {notifications.map(notif => (
                      <div key={notif.id} className={styles.notificationItem}>
                        <p className={styles.notificationTitle}>{notif.title}</p>
                        <p className={styles.notificationTime}>{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Menu button (Mobile) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${styles.actionBtn} ${styles.mobile}`}
            >
              {isMenuOpen ? <X className={styles.menuIcon} /> : <Menu className={styles.menuIcon} />}
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm (Mobile) */}
        <div className={`${styles.searchBox} ${styles.mobile}`}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm địa điểm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchInput}
            className={styles.searchInput}
          />
        </div>

        {/* Navigation menu (Mobile) */}
        {isMenuOpen && (
          <nav className={`${styles.nav} ${styles.mobile}`}>
            <a href="#hien-tai" className={styles.navLink}>Hiện tại</a>
            <a href="#theo-gio" className={styles.navLink}>Theo giờ</a>
            <a href="#7-ngay" className={styles.navLink}>7 ngày tới</a>
            <a href="#ban-do" className={styles.navLink}>Bản đồ radar</a>
            <button onClick={toggleDarkMode} className={styles.navLink}>
              {isDarkMode ? <Sun className={styles.icon} /> : <Moon className={styles.icon} />}
              <span>{isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}</span>
            </button>
          </nav>
        )}

        {/* Navigation menu (Desktop) */}
        <nav className={`${styles.nav} ${styles.desktop}`}>
          <a href="#hien-tai" className={styles.navLink}>Hiện tại</a>
          <a href="#theo-gio" className={styles.navLink}>Theo giờ</a>
          <a href="#7-ngay" className={styles.navLink}>7 ngày tới</a>
          <a href="#ban-do" className={styles.navLink}>Bản đồ radar</a>
          <a href="#canh-bao" className={styles.navLink}>Cảnh báo</a>
        </nav>
      </div>
    </header>
  );
}