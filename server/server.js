const express = require("express");
const cors = require("cors");
require("dotenv").config();
console.log("API KEY:", process.env.API_KEY);

const weatherRoutes = require("./routes/weatherRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/weather", weatherRoutes);

// Kiểm tra hệ thống có hoạt động tốt không? (Health check)
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Weather API Server is running" });
});

// Middleware xử lý lỗi (Error handling middleware)
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({
    error: "Có lỗi xảy ra!",
    message: error.message,
  });
});

// Lỗi 404
app.use((req, res) => {
  res.status(404).json({ error: "Không tìm thấy đường dẫn!" });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
  console.log(`API sẵn sàng http://localhost:${PORT}/api`);
});
