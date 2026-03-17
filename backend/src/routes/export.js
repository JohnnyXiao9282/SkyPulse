import express from 'express';
import Weather from '../models/Weather.js';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const router = express.Router();

// Export weather data as JSON
router.get('/json', async (req, res) => {
  try {
    const records = await Weather.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export data.' });
  }
});

// Export weather data as CSV
router.get('/csv', async (req, res) => {
  try {
    const records = await Weather.find();
    const csvWriter = createObjectCsvWriter({
      path: 'weather_export.csv',
      header: [
        { id: 'location', title: 'Location' },
        { id: 'date', title: 'Date' },
        { id: 'weatherData', title: 'WeatherData' },
      ],
    });
    await csvWriter.writeRecords(records.map(r => ({
      location: r.location,
      date: r.date,
      weatherData: JSON.stringify(r.weatherData),
    })));
    res.download('weather_export.csv', 'weather_export.csv', err => {
      if (err) res.status(500).json({ error: 'Failed to download CSV.' });
      fs.unlinkSync('weather_export.csv');
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV.' });
  }
});

export default router;
