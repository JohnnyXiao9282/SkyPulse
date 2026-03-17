import express from 'express';
import axios from 'axios';

const router = express.Router();

// Example: Get YouTube videos for a location
router.get('/youtube', async (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: 'Location required.' });
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(location)} travel&key=${apiKey}&type=video&maxResults=5`;
    const response = await axios.get(url);
    res.json(response.data.items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch YouTube videos.' });
  }
});

// Example: Get Google Maps embed URL for a location
router.get('/map', (req, res) => {
  const { location } = req.query;
  if (!location) return res.status(400).json({ error: 'Location required.' });
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;
  res.json({ embedUrl });
});

export default router;
