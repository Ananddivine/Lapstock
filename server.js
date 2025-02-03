const express = require("express");
const connectDB = require("./config/db"); // Import connectDB
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware to parse JSON data from POST requests
app.use(express.json());

// Connect to MongoDB
connectDB(); // Call connectDB to connect to MongoDB

// Device Schema
const deviceSchema = new mongoose.Schema({
  serial_number: { type: String, required: true },
  model: { type: String, required: true },
  config: { type: String, required: true },
  storage: String,
  ram: String,
});

// Device Model
const Device = mongoose.model("Device", deviceSchema);

// API routes
app.post("/validate", (req, res) => {
  const { name, token } = req.body;
  if (name === "lapstock" && token === "12345") {
    return res.json({ status: "success" });
  } else {
    return res.status(400).json({ status: "error", message: "Invalid name or token" });
  }
});

app.post("/register", async (req, res) => {
  const { serial_number, model, config, storage, ram } = req.body;

  // Validate the required fields
  if (!serial_number || !model || !config) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields: serial_number, model, and config are required.",
    });
  }

  try {
    // Create a new device instance with the received data
    const device = new Device({
      serial_number,
      model,
      config,
      storage,
      ram,
    });

    // Save the device to the database
    await device.save();

    // Return a success response
    res.status(201).json({ status: "success", message: "Device registered successfully" });
  } catch (error) {
    // Handle any errors during the save operation
    console.error("Error registering device:", error);
    res.status(500).json({ status: "error", message: "Failed to register device. Please try again later." });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
