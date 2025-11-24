const express = require("express");
const router = express.Router();
const weatherService = require("../services/weatherService");

// GET /api/weather/current/:lat/:lon
router.get("/current/:lat/:lon", async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const weather = await weatherService.getCurrentWeather(
      parseFloat(lat),
      parseFloat(lon)
    );
    res.json(weather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/forecast/:lat/:lon
router.get("/forecast/:lat/:lon", async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const forecast = await weatherService.getForecast(
      parseFloat(lat),
      parseFloat(lon)
    );
    res.json(forecast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/tourist/:locationId
router.get("/tourist/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const data = await weatherService.getWeatherForTouristLocation(locationId);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// GET /api/weather/tourist-all
router.get("/tourist-all", async (req, res) => {
  try {
    const data = await weatherService.getAllTouristWeather();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/search?q=query
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: "Query parameter required" });
    }
    const results = await weatherService.searchLocation(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/weather/locations - Danh sách địa điểm du lịch
router.get("/locations", (req, res) => {
  res.json(weatherService.TOURIST_LOCATIONS);
});

module.exports = router;
