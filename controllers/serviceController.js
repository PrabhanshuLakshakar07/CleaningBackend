const cloudinary = require("../utils/cloudinary");
const pool = require("../db"); // your Postgres connection

// Add new service by admin
exports.createService = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) return res.status(400).json({ message: "Image required" });

    const result = await cloudinary.uploader.upload(req.file.path);

    const imageUrl = result.secure_url;

    const dbRes = await pool.query(
      "INSERT INTO services (title, description, image_url, category) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, imageUrl, category]
    );

    res.status(201).json({ message: "Service created", service: dbRes.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error creating service", error: err.message });
  }
};

// Client view services
exports.getServices = async (req, res) => {
  const { category } = req.query;

  try {
    let query = "SELECT * FROM services";
    const values = [];

    if (category) {
      query += " WHERE category = $1";
      values.push(category);
    }

    const result = await pool.query(query, values);
    res.status(200).json({ services: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err.message });
  }
};
