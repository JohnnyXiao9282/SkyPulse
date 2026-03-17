import mongoose from "mongoose";

const WeatherSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    lat: Number,
    lon: Number,
  },
  date: {
    type: Date,
    required: true,
  },
  weatherData: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Weather", WeatherSchema);
