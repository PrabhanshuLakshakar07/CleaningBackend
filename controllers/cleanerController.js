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
   await pool.query("UPDATE bookings SET cleaner_id = $1, status = 'assigned' WHERE id = $2", [cleanerId, jobId]);


    res.status(200).json({ message: "Job accepted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error accepting job", error: err.message });
  }
};
// GET /api/cleaner/bookings?status=pending
exports.getAssignedBookings = async (req, res) => {
  const cleanerId = req.user.id;
  const { status } = req.query;

  try {
    let query = `SELECT * FROM bookings WHERE cleaner_id = $1`;
    const values = [cleanerId];

    if (status) {
      query += ` AND status = $2`;
      values.push(status);
    }

    query += ` ORDER BY date DESC`;

    const result = await pool.query(query, values);
    res.status(200).json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};

// PUT /api/cleaner/bookings/:id/status
exports.updateBookingStatus = async (req, res) => {
  const cleanerId = req.user.id;
  const bookingId = req.params.id;
  const { status, otp } = req.body; // include OTP in body

  if (!["accepted", "rejected", "completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const check = await pool.query(
      "SELECT * FROM bookings WHERE id = $1 AND cleaner_id = $2",
      [bookingId, cleanerId]
    );

    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Unauthorized or booking not found" });
    }

    const booking = check.rows[0];

    // ✅ OTP verification required for "completed"
    if (status === "completed") {
      if (!otp || otp !== booking.otp) {
        return res.status(400).json({ message: "Invalid or missing OTP" });
      }
    }

    await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [status, bookingId]);
    res.status(200).json({ message: `Booking marked as ${status}` });
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

