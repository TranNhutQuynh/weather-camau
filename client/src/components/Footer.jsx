import React from 'react';
import { 
  Cloud, MapPin, Mail, Phone, Facebook, 
  Youtube, Instagram, ExternalLink, Heart 
} from 'lucide-react';
import styles from '../styles/Footer.module.css';

export default function WeatherFooter() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Trang chủ', href: '#' },
    { name: 'Dự báo 7 ngày', href: '#7-ngay' },
    { name: 'Bản đồ radar', href: '#ban-do' },
    { name: 'Cảnh báo', href: '#canh-bao' }
  ];

  const weatherInfo = [
    { name: 'Thông tin thời tiết', href: '#' },
    { name: 'Khí tượng thủy văn', href: '#' },
    { name: 'Biến đổi khí hậu', href: '#' },
    { name: 'Hỏi đáp', href: '#' }
  ];

  const aboutLinks = [
    { name: 'Giới thiệu', href: '#' },
    { name: 'Liên hệ', href: '#' },
    { name: 'Điều khoản sử dụng', href: '#' },
    { name: 'Chính sách bảo mật', href: '#' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Main footer content */}
        <div className={styles.footerMain}>
          
          {/* Logo và thông tin */}
          <div className={styles.footerCol}>
            <div className={styles.logoSection}>
              <Cloud className={styles.logoIcon} />
              <h3 className={styles.logoTitle}>Thời Tiết Bạc Liêu</h3>
            </div>
            <p className={styles.description}>
              Website cung cấp thông tin dự báo thời tiết chính xác, 
              cập nhật liên tục cho tỉnh Bạc Liêu và các khu vực lân cận.
            </p>
            
            {/* Thông tin liên hệ */}
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <MapPin className={styles.contactIcon} />
                <span>Tỉnh Bạc Liêu, Việt Nam</span>
              </div>
              <div className={styles.contactItem}>
                <Phone className={styles.contactIcon} />
                <span>0291.3.xxx.xxx</span>
              </div>
              <div className={styles.contactItem}>
                <Mail className={styles.contactIcon} />
                <span>info@thoitietbaclieu.vn</span>
              </div>
            </div>

            {/* Social media */}
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialBtn} title="Facebook">
                <Facebook className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialBtn} title="Youtube">
                <Youtube className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialBtn} title="Instagram">
                <Instagram className={styles.socialIcon} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.footerCol}>
            <h4 className={styles.colTitle}>Liên kết nhanh</h4>
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.link}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Weather Info */}
          <div className={styles.footerCol}>
            <h4 className={styles.colTitle}>Thông tin</h4>
            <ul className={styles.linkList}>
              {weatherInfo.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.link}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className={styles.footerCol}>
            <h4 className={styles.colTitle}>Về chúng tôi</h4>
            <ul className={styles.linkList}>
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={styles.link}>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Data source */}
            <div className={styles.dataSource}>
              <p className={styles.sourceTitle}>Nguồn dữ liệu:</p>
              <a href="#" className={styles.sourceLink}>
                <span>Đài Khí tượng Thủy văn</span>
                <ExternalLink className={styles.externalIcon} />
              </a>
              <a href="#" className={styles.sourceLink}>
                <span>OpenWeatherMap</span>
                <ExternalLink className={styles.externalIcon} />
              </a>
            </div>
          </div>

        </div>

        {/* Footer bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.divider}></div>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              © {currentYear} Thời Tiết Bạc Liêu. All rights reserved.
            </p>
            <p className={styles.madeWith}>
              Made with <Heart className={styles.heartIcon} /> in Bạc Liêu
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}