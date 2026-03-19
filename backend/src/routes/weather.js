import express from "express";
import axios from "axios";
import Weather from "../models/Weather.js";
// YouTube Data API integration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search";

const router = express.Router();

// GET: Fetch weather-related YouTube videos for a location
router.get("/videos", async (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ error: "Missing location parameter." });
  }
  try {
    const params = {
      part: "snippet",
      q: `${location} weather forecast`,
      key: YOUTUBE_API_KEY,
      maxResults: 5,
      type: "video",
      safeSearch: "strict",
    };
    const response = await axios.get(YOUTUBE_SEARCH_URL, { params });
    const videos = response.data.items.map((item) => ({
      title: item.snippet.title,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
    res.json({ location, videos });
  } catch (err) {
    console.error("GET /api/weather/videos error:", err);
    return res.status(500).json({ error: "Failed to fetch YouTube videos." });
  }
});


// Helper: Validate date range
function isValidDateRange(start, end) {
  return new Date(start) <= new Date(end);
}

// CREATE: Add weather data for a location and date range
router.post("/", async (req, res) => {
  const { location, startDate, endDate } = req.body;
  if (!location || !startDate || !endDate) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (!isValidDateRange(startDate, endDate)) {
    return res.status(400).json({ error: "Invalid date range." });
  }
  // Fetch weather data from API
  try {
    // Use OpenWeatherMap API
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      location
    )}&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    // Filter data by date range
    const weatherList = response.data.list.filter((item) => {
      const dt = new Date(item.dt_txt);
      return dt >= new Date(startDate) && dt <= new Date(endDate);
    });
    const weatherDoc = new Weather({
      location,
      date: new Date(startDate),
      weatherData: weatherList,
    });
    await weatherDoc.save();
    res.status(201).json(weatherDoc);
  } catch (err) {
    console.error("POST /api/weather error:", err);
    if (err.response?.data) {
      res.status(500).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: "Failed to fetch or save weather data." });
    }
  }
});

// Get all weather records
router.get("/", (req, res) => {
  Weather.find()
    .then((records) => res.json(records))
    .catch(() => res.status(500).json({ error: "Failed to fetch records." }));
});

// UPDATE: Update a weather record by ID
router.put("/:id", (req, res) => {
  Weather.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updated) => {
      if (!updated) {
        res.status(404).json({ error: "Record not found." });
      } else {
        res.json(updated);
      }
    })
    .catch(() => res.status(500).json({ error: "Failed to update record." }));
});

// DELETE: Delete a weather record by ID
router.delete("/:id", (req, res) => {
  Weather.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      if (!deleted) {
        res.status(404).json({ error: "Record not found." });
      } else {
        res.json({ message: "Record deleted." });
      }
    })
    .catch(() => res.status(500).json({ error: "Failed to delete record." }));
});

export default router;
