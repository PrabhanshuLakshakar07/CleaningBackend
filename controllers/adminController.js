const pool = require("../db");

// GET /api/admin/unassigned-bookings
exports.getUnassignedBookings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings WHERE cleaner_id IS NULL ORDER BY created_at DESC"
    );
    res.status(200).json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Error fetching unassigned bookings", error: err.message });
  }
};

// PATCH /api/admin/bookings/:id/assign
exports.assignCleaner = async (req, res) => {
  const bookingId = req.params.id;
  const { cleaner_id } = req.body;

  try {
    const cleanerCheck = await pool.query("SELECT * FROM users WHERE id = $1 AND role = 'cleaner'", [cleaner_id]);

    if (cleanerCheck.rows.length === 0) {
      return res.status(400).json({ message: "Cleaner not found" });
    }

    const update = await pool.query(
      "UPDATE bookings SET cleaner_id = $1 WHERE id = $2 RETURNING *",
      [cleaner_id, bookingId]
    );

    if (update.rowCount === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Cleaner assigned successfully", booking: update.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Error assigning cleaner", error: err.message });
  }
};
exports.getAnalytics = async (req, res) => {
  try {
    const usersCount = await pool.query(`
      SELECT role, COUNT(*) FROM users GROUP BY role
    `);

    const bookingCount = await pool.query(`
      SELECT status, COUNT(*) FROM bookings GROUP BY status
    `);

    const totalBookings = await pool.query(`SELECT COUNT(*) FROM bookings`);
    const totalComplaints = await pool.query(`SELECT COUNT(*) FROM complaints`);

    res.status(200).json({
      total_users: usersCount.rows,
      total_bookings: parseInt(totalBookings.rows[0].count),
      booking_status_breakdown: bookingCount.rows,
      total_complaints: parseInt(totalComplaints.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics fetch failed", error: err.message });
  }
};
