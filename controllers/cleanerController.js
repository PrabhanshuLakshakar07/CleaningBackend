const pool = require("../db");

// GET /api/cleaner/jobs
exports.getAvailableJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE cleaner_id IS NULL ORDER BY created_at DESC"
    );
    res.status(200).json({ jobs: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs", error: err.message });
  }
};

// POST /api/cleaner/jobs/:id/accept
exports.acceptJob = async (req, res) => {
  const cleanerId = req.user.id;
  const jobId = req.params.id;

  try {
    // Check booking exists and not taken
    const check = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND cleaner_id IS NULL",
      [jobId]
    );

    if (check.rows.length === 0) {
      return res.status(400).json({ message: "Job not found or already accepted" });
    }

    // Assign cleaner
    await pool.query("UPDATE bookings SET cleaner_id = $1 WHERE id = $2", [cleanerId, jobId]);

    res.status(200).json({ message: "Job accepted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting job", error: err.message });
  }
};
