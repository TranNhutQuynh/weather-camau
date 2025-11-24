const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// Toạ độ các điểm du lịch của Tỉnh Cà Mau
const TOURIST_LOCATIONS = {
  // Khu vực Cà Mau cũ
  "ca-mau-city": {
    name: "Thành phố Cà Mau",
    lat: 9.1526,
    lon: 105.196,
    region: "Cà Mau",
    description: "Trung tâm tỉnh Cà Mau với những con đường rợp bóng cây xanh",
    attractions: ["Chợ Cà Mau", "Nhà thờ Cà Mau", "Công viên 19/8"],
    image: "/images/tourist/TP_CaMau.jpg",
    rating: 4.2,
  },
  "dat-mui": {
    name: "Mũi Cà Mau",
    lat: 8.6044,
    lon: 104.7282,
    region: "Cà Mau",
    description: "Điểm cực Nam Việt Nam - nơi đất trời giao hòa",
    attractions: [
      "Cột mốc GPS",
      "Khu du lịch sinh thái Mũi Cà Mau",
      "Hải đăng Mũi Cà Mau",
      "Rừng tràm Mũi",
    ],
    image: "/images/tourist/khu-du-lich-mui-ca-mau.jpg",
    rating: 4.8,
  },
  "u-minh-ha": {
    name: "Rừng U Minh Hạ",
    lat: 9.3333,
    lon: 105.05,
    region: "Cà Mau",
    description: "Vườn quốc gia rừng ngập mặn với hệ sinh thái độc đáo",
    attractions: [
      "Rừng tràm U Minh",
      "Kênh rạch sinh thái",
      "Động vật hoang dã",
    ],
    image: "/images/tourist/vuon-quoc-gia-u-minh-ha.jpg",
    rating: 4.5,
  },
  "nam-can": {
    name: "Huyện Nam Căn",
    lat: 8.75,
    lon: 105.0833,
    region: "Cà Mau",
    description: "Vùng biển đảo cực Nam với cảnh quan hoang sơ",
    attractions: [
      "Đảo Hòn Khoai",
      "Bãi biển Nam Căn",
      "Chợ hải sản",
      "Đảo Hòn Chuối",
    ],
    image: "/images/tourist/du-lich-nam-can-ca-mau.jpg",
    rating: 4.3,
  },
  "dam-doi": {
    name: "Khu du lịch Đầm Dơi",
    lat: 9.1,
    lon: 105.15,
    region: "Cà Mau",
    description: "Khu bảo tồn thiên nhiên nổi tiếng với đàn dơi khổng lồ",
    attractions: [
      "Đàn dơi khổng lồ",
      "Rừng ngập mặn",
      "Chùa Đầm Dơi",
      "Chợ nổi Cà Mau",
    ],
    image: "/images/tourist/dam-doi.jpg",
    rating: 4.4,
  },
  "ca-mau-cape-park": {
    name: "Vườn Quốc gia Mũi Cà Mau",
    lat: 8.61,
    lon: 104.73,
    region: "Cà Mau",
    description: "Vườn quốc gia sinh thái biển bảo tồn đa dạng sinh học",
    attractions: [
      "Hải đăng cổ",
      "Rừng tràm nguyên sinh",
      "Bảo tàng biển",
      "Khu bảo tồn rùa biển",
    ],
    image: "/images/tourist/dao-hon-khoai.jpg",
    rating: 4.7,
  },
  // Khu vực Bạc Liêu cũ (nay thuộc Cà Mau)
  "bac-lieu-city": {
    name: "Thành phố Bạc Liêu",
    lat: 9.294,
    lon: 105.7215,
    region: "Bạc Liêu (cũ)",
    description: "Thủ phủ miền Tây, quê hương công tử Bạc Liêu nổi tiếng",
    attractions: [
      "Nhà thờ Bạc Liêu",
      "Nhà công tử Bạc Liêu",
      "Chợ Bạc Liêu",
      "Bảo tàng Bạc Liêu",
    ],
    image: "/images/tourist/tp-bac-lieu.jpg",
    rating: 4.3,
  },
  "nha-cong-tu": {
    name: "Nhà Công tử Bạc Liêu",
    lat: 9.285,
    lon: 105.724,
    region: "Bạc Liêu (cũ)",
    description: "Di tích lịch sử văn hóa nổi tiếng với kiến trúc Pháp cổ",
    attractions: [
      "Biệt thự cổ",
      "Vườn cây cảnh",
      "Bảo tàng tư liệu",
      "Khu ẩm thực",
    ],
    image: "/images/tourist/Nha-Cong-tu-Bac-Lieu.png",
    rating: 4.6,
  },
  "me-nam-hai": {
    name: "Mẹ Nam Hải (Quan Âm Phật Đài)",
    lat: 9.28,
    lon: 105.735,
    region: "Bạc Liêu",
    description:
      "Khu Quán Âm Phật Đài với tượng Mẹ Nam Hải linh thiêng nổi tiếng tại Bạc Liêu.",
    attractions: [
      "Tượng Quan Âm Nam Hải cao 11m",
      "Khuôn viên Phật Đài rộng rãi",
      "Không gian ven biển thoáng mát",
      "Khu hành hương và lễ hội",
    ],
    image: "/images/tourist/Me-Nam-Hai.jpg",
    rating: 4.4,
  },

  "nha-tho-bac-lieu": {
    name: "Nhà thờ Tắc Sậy",
    lat: 9.275,
    lon: 105.718,
    region: "Bạc Liêu (cũ)",
    description: "Nhà thờ cổ kiến trúc Pháp độc đáo",
    attractions: ["Kiến trúc Gothic", "Vườn hoa", "Tượng Đức Mẹ"],
    image: "/images/tourist/nha-tho-tac-say.jpg",
    rating: 4.2,
  },
  "bao-tang-bac-lieu": {
    name: "Bảo tàng Bạc Liêu",
    lat: 9.292,
    lon: 105.725,
    region: "Bạc Liêu (cũ)",
    description: "Lưu giữ di sản văn hóa Bạc Liêu qua các thời kỳ",
    attractions: ["Hiện vật lịch sử", "Trưng bày văn hóa", "Cổ vật dân tộc"],
    image: "/images/tourist/bao-tang-bac-lieu.jpg",
    rating: 4.1,
  },
  "rung-tram-tra-su": {
    name: "Rừng tràm Trà Sư",
    lat: 9.35,
    lon: 105.68,
    region: "Bạc Liêu (cũ)",
    description: "Khu rừng tràm ngập nước đẹp nhất ĐBSCL",
    attractions: [
      "Rừng tràm nguyên sinh",
      "Du thuyền sinh thái",
      "Đa dạng sinh học",
      "Chim cò di cư",
    ],
    image: "/images/tourist/rung-tram-su.png",
    rating: 4.7,
  },
  "cho-bac-lieu": {
    name: "Chợ Bạc Liêu",
    lat: 9.2935,
    lon: 105.722,
    region: "Bạc Liêu (cũ)",
    description: "Chợ trung tâm sầm uất với đặc sản miền Tây",
    attractions: [
      "Hải sản tươi sống",
      "Đặc sản địa phương",
      "Ẩm thực đường phố",
    ],
    image: "/images/tourist/cho-bac-lieu.jpg",
    rating: 4.0,
  },
  "bai-bien-nha-mat": {
    name: "Bãi biển Nhà Mát",
    lat: 9.22,
    lon: 105.55,
    region: "Bạc Liêu (cũ)",
    description: "Khu du lịch biển sinh thái với bãi cát vàng tuyệt đẹp",
    attractions: [
      "Bãi biển đẹp",
      "Rừng dừa nước",
      "Nhà hàng hải sản",
      "Cắm trại",
    ],
    image: "/images/tourist/khu-du-lich-nha-mat-bac-lieu.jpg",
    rating: 4.5,
  },
  "cong-vien-gio-bac-lieu": {
    name: "Công viên Điện gió Bạc Liêu",
    lat: 9.25,
    lon: 105.48,
    region: "Bạc Liêu (cũ)",
    description: "Nhà máy điện gió đầu tiên VN với cảnh quan ấn tượng",
    attractions: [
      "Cối xay gió khổng lồ",
      "Tua du lịch",
      "Chụp ảnh",
      "Tìm hiểu năng lượng",
    ],
    image: "/images/tourist/dien-gio-bac-lieu.jpg",
    rating: 4.4,
  },
  "lang-co-gia-rai": {
    name: "Làng cổ Giá Rai",
    lat: 9.32,
    lon: 105.65,
    region: "Bạc Liêu (cũ)",
    description: "Làng cổ văn hóa Khmer với những nét đẹp truyền thống",
    attractions: ["Chùa Khmer cổ", "Làng nghề truyền thống", "Văn hóa dân tộc"],
    image: "/images/tourist/chua-kherme-co-gia-rai.jpg",
    rating: 4.2,
  },
  "cho-ca-mau-moi": {
    name: "Chợ Mới Cà Mau",
    lat: 9.26,
    lon: 105.71,
    region: "Bạc Liêu (cũ)",
    description: "Chợ đặc sản lớn với hương vị miền Tây đặc trưng",
    attractions: [
      "Hải sản khô",
      "Mắm đặc sản",
      "Bánh tráng",
      "Trái cây nhiệt đới",
    ],
    image: "/images/tourist/cho-noi-ca-mau.jpg",
    rating: 4.1,
  },
};

// Lấy thời tiết hiện tại
async function getCurrentWeather(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "vi",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu thời tiết hiện tại:", error);
    throw error;
  }
}

// Lấy dự báo (Forecast) theo giờ và 7 ngày
async function getForecast(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "vi",
        cnt: 40, // 5 ngày x 8 lần / ngày
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy dự báo: ", error);
    throw error;
  }
}

// Lấy dữ liệu ô nhiễm không khí (Air Pollution)
async function getAirPollution(lat, lon) {
  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi lấy dữ liệu ô nhiễm không khí: ", error);
    return null;
  }
}

// Format dữ liệu thời tiết cho frontend
function formatWeatherData(current, forecast, airPollution) {
  return {
    current: {
      temp: Math.round(current.main.temp),
      feelsLike: Math.round(current.main.feels_like), // Sửa từ fells_like
      humidity: current.main.humidity,
      pressure: current.main.pressure,
      windSpeed: Math.round(current.wind.speed * 3.6), // Sửa từ current.main.windSpeed
      visibility: Math.round(current.visibility / 1000),
      condition: current.weather[0].description,
      icon: current.weather[0].icon,
      uvIndex: airPollution ? airPollution.list[0].components.pm2_5 : 0,
      sunrise: current.sys.sunrise,
      sunset: current.sys.sunset,
    },
    hourly: forecast.list.slice(0, 8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      condition: item.weather[0].description,
      rain: item.pop * 100,
    })),
    daily: getDailyForecast(forecast.list),
  };
}

// Nhóm dự báo theo ngày
function getDailyForecast(forecastList) {
  const dailyData = {};

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("vi-VN"); // Sửa từ toLocaleTimeString
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        conditions: [],
        rain: [],
        dt: item.dt,
      };
    }
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].conditions.push(item.weather[0]); // Sửa từ condition
    dailyData[date].rain.push(item.pop);
  });

  return Object.entries(dailyData)
    .slice(0, 7)
    .map(([date, data]) => ({
      date,
      day: new Date(data.dt * 1000).toLocaleDateString("vi-VN", {
        weekday: "short",
      }),
      high: Math.round(Math.max(...data.temps)),
      low: Math.round(Math.min(...data.temps)),
      condition: data.conditions[0].description, // Sửa từ condition
      icon: data.conditions[0].icon,
      rain: Math.round(Math.max(...data.rain) * 100),
    }));
}

// Lấy thời tiết cho địa điểm du lịch
async function getWeatherForTouristLocation(locationId) {
  // Sửa tên hàm
  const location = TOURIST_LOCATIONS[locationId];
  if (!location) {
    throw new Error("Không tìm thấy địa điểm.");
  }

  const [current, forecast, airPollution] = await Promise.all([
    getCurrentWeather(location.lat, location.lon),
    getForecast(location.lat, location.lon),
    getAirPollution(location.lat, location.lon),
  ]);

  return {
    location: {
      ...location,
      id: locationId,
    },
    weather: formatWeatherData(current, forecast, airPollution), // Sửa tên hàm
  };
}

// Lấy thời tiết cho tất cả địa điểm
async function getAllTouristWeather() {
  const weatherPromises = Object.keys(TOURIST_LOCATIONS).map(
    (
      id // Sửa từ weatherPromise
    ) =>
      getWeatherForTouristLocation(id).catch((err) => ({
        locationId: id,
        error: err.message,
      }))
  );
  return Promise.all(weatherPromises); // Thêm dấu chấm phẩy
}

// Tìm kiếm địa điểm - ĐÃ SỬA ĐỂ TÌM ĐƯỢC CÁC HUYỆN
async function searchLocation(query) {
  try {
    // Tìm kiếm với nhiều biến thể khác nhau để tăng độ chính xác
    const searchQueries = [
      query,
      `${query}, Cà Mau, Vietnam`,
      `${query}, Bạc Liêu, Vietnam`,
      `${query}, Việt Nam`,
    ];

    // Thử tìm kiếm với từng query
    for (const searchQuery of searchQueries) {
      try {
        const response = await axios.get(
          "http://api.openweathermap.org/geo/1.0/direct",
          {
            params: {
              q: searchQuery,
              limit: 10, // Tăng limit để có nhiều kết quả hơn
              appid: API_KEY,
            },
          }
        );

        if (response.data && response.data.length > 0) {
          // Lọc kết quả chỉ lấy ở Việt Nam
          const vietnamResults = response.data.filter(
            (location) =>
              location.country === "VN" || location.country === "Vietnam"
          );

          if (vietnamResults.length > 0) {
            // Format lại kết quả để hiển thị đẹp hơn
            return vietnamResults.map((location) => ({
              name: location.local_names?.vi || location.name,
              lat: location.lat,
              lon: location.lon,
              country: "Việt Nam",
              state: location.state || "",
              displayName: `${location.local_names?.vi || location.name}${
                location.state ? ", " + location.state : ""
              }, Việt Nam`,
            }));
          }
        }
      } catch (err) {
        console.log(`Không tìm thấy với query: ${searchQuery}`);
        continue;
      }
    }

    // Nếu không tìm thấy qua API, tìm trong danh sách địa điểm du lịch
    const localResults = Object.entries(TOURIST_LOCATIONS)
      .filter(([id, location]) => {
        const searchLower = query.toLowerCase();
        return (
          location.name.toLowerCase().includes(searchLower) ||
          location.description.toLowerCase().includes(searchLower) ||
          location.region.toLowerCase().includes(searchLower)
        );
      })
      .map(([id, location]) => ({
        name: location.name,
        lat: location.lat,
        lon: location.lon,
        country: "Việt Nam",
        state: location.region,
        displayName: `${location.name}, ${location.region}`,
        isLocal: true, // Đánh dấu là kết quả từ database local
      }));

    if (localResults.length > 0) {
      return localResults;
    }

    // Nếu vẫn không tìm thấy, trả về mảng rỗng
    console.log(`Không tìm thấy kết quả nào cho: ${query}`);
    return [];
  } catch (error) {
    console.error("Lỗi tìm kiếm địa điểm: ", error);
    throw error;
  }
}

module.exports = {
  getCurrentWeather,
  getForecast,
  getAirPollution,
  formatWeatherData, // Sửa tên export
  getWeatherForTouristLocation, // Sửa tên export
  getAllTouristWeather,
  searchLocation,
  TOURIST_LOCATIONS,
};
