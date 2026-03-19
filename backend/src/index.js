import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.js";
import exportRoutes from "./routes/export.js";
import extraRoutes from "./routes/extra.js";

dotenv.config();

const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/weather", weatherRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/extra", extraRoutes);

app.get("/", (req, res) => {
  res.send("Weather App Backend API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
