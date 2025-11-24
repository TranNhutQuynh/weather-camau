// utils/mapsHelper.js

/**
 * Helper functions để mở Google Maps
 */

// Kiểm tra xem có phải mobile không
export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  
  // Kiểm tra xem có phải iOS không
  export const isIOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  };
  
  // Kiểm tra xem có phải Android không
  export const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
  };
  
  /**
   * Mở Google Maps để chỉ đường
   * @param {number} lat - Vĩ độ
   * @param {number} lon - Kinh độ
   * @param {string} name - Tên địa điểm
   * @returns {boolean} - True nếu thành công
   */
  export const openGoogleMapsNavigation = (lat, lon, name = '') => {
    try {
      const isMobile = isMobileDevice();
      
      if (isMobile) {
        // Mobile: Thử mở Google Maps app trước
        if (isIOS()) {
          // iOS: Thử mở Google Maps app, fallback về Apple Maps
          const googleMapsUrl = `comgooglemaps://?daddr=${lat},${lon}&directionsmode=driving`;
          const appleMapsUrl = `maps://maps.apple.com/?daddr=${lat},${lon}`;
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
          
          // Thử mở Google Maps app
          window.location.href = googleMapsUrl;
          
          // Sau 2 giây, nếu vẫn ở trang này thì mở web
          setTimeout(() => {
            if (!document.hidden) {
              window.location.href = webUrl;
            }
          }, 2000);
          
          return true;
        } else if (isAndroid()) {
          // Android: Thử mở Google Maps app
          const appUrl = `geo:${lat},${lon}?q=${lat},${lon}(${encodeURIComponent(name || 'Destination')})`;
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
          
          window.location.href = appUrl;
          
          setTimeout(() => {
            if (!document.hidden) {
              window.location.href = webUrl;
            }
          }, 2000);
          
          return true;
        }
      }
      
      // Desktop hoặc fallback: Mở web version
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
      
      // Thử mở tab mới
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      // Nếu bị chặn popup
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Tạo link ẩn và click
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return true;
    } catch (error) {
      console.error('Error opening Google Maps:', error);
      
      // Last resort: Redirect
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
      if (window.confirm('Không thể mở Google Maps trong tab mới. Chuyển hướng đến Google Maps?')) {
        window.location.href = url;
      }
      
      return false;
    }
  };
  
  /**
   * Xem địa điểm trên Google Maps (không chỉ đường)
   * @param {number} lat - Vĩ độ
   * @param {number} lon - Kinh độ
   * @param {string} name - Tên địa điểm
   * @returns {boolean} - True nếu thành công
   */
  export const viewLocationOnMap = (lat, lon, name = '') => {
    try {
      const isMobile = isMobileDevice();
      
      if (isMobile) {
        // Mobile: Thử mở app
        if (isIOS()) {
          const googleMapsUrl = `comgooglemaps://?q=${lat},${lon}`;
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
          
          window.location.href = googleMapsUrl;
          
          setTimeout(() => {
            if (!document.hidden) {
              window.location.href = webUrl;
            }
          }, 2000);
          
          return true;
        } else if (isAndroid()) {
          const appUrl = `geo:${lat},${lon}?q=${lat},${lon}`;
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
          
          window.location.href = appUrl;
          
          setTimeout(() => {
            if (!document.hidden) {
              window.location.href = webUrl;
            }
          }, 2000);
          
          return true;
        }
      }
      
      // Desktop: Mở web
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return true;
    } catch (error) {
      console.error('Error viewing map:', error);
      
      const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      if (window.confirm('Không thể mở bản đồ trong tab mới. Chuyển hướng đến Google Maps?')) {
        window.location.href = url;
      }
      
      return false;
    }
  };
  
  /**
   * Lấy Google Maps embed URL
   * @param {number} lat - Vĩ độ
   * @param {number} lon - Kinh độ
   * @returns {string} - Embed URL
   */
  export const getGoogleMapsEmbedUrl = (lat, lon) => {
    return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15000!2d${lon}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890`;
  };
  
  /**
   * Tạo Google Maps static image URL
   * @param {number} lat - Vĩ độ
   * @param {number} lon - Kinh độ
   * @param {number} zoom - Zoom level (mặc định 15)
   * @param {string} size - Kích thước (mặc định "600x400")
   * @returns {string} - Static image URL
   */
  export const getGoogleMapsStaticImageUrl = (lat, lon, zoom = 15, size = "600x400") => {
    // Lưu ý: Cần API key cho static maps
    // return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=${size}&markers=color:red%7C${lat},${lon}&key=YOUR_API_KEY`;
    
    // Không cần API key: dùng OpenStreetMap
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.01},${lat-0.01},${lon+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lon}`;
  };
  
  /**
   * Kiểm tra xem có thể mở Google Maps không
   * @returns {Promise<boolean>}
   */
  export const checkGoogleMapsAvailability = async () => {
    try {
      const response = await fetch('https://www.google.com/maps', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      console.error('Google Maps not available:', error);
      return false;
    }
  };
  
  /**
   * Copy tọa độ vào clipboard
   * @param {number} lat - Vĩ độ
   * @param {number} lon - Kinh độ
   * @returns {Promise<boolean>}
   */
  export const copyCoordinatesToClipboard = async (lat, lon) => {
    try {
      const text = `${lat}, ${lon}`;
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  };
  
  export default {
    openGoogleMapsNavigation,
    viewLocationOnMap,
    getGoogleMapsEmbedUrl,
    getGoogleMapsStaticImageUrl,
    checkGoogleMapsAvailability,
    copyCoordinatesToClipboard,
    isMobileDevice,
    isIOS,
    isAndroid
  };