import express from "express";
import Weather from "../models/Weather.js";
import axios from "axios";

const router = express.Router();

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
  // Fetch weather data from API (placeholder, implement real API call)
  try {
    // Example: Use OpenWeatherMap API (replace with your API key)
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
    res.status(500).json({ error: "Failed to fetch or save weather data." });
  }
});

// READ: Get all weather records
router.get("/", async (req, res) => {
  try {
    const records = await Weather.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch records." });
  }
});

// UPDATE: Update a weather record by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Weather.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Record not found." });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update record." });
  }
});

// DELETE: Delete a weather record by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Weather.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Record not found." });
    res.json({ message: "Record deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete record." });
  }
});

export default router;
