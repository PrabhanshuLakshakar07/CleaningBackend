const pool = require("../db");

exports.createBooking = async (req, res) => {
  const clientId = req.user.id;
  const { service_type, date, time_slot } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();


  try {
   const result = await pool.query(
  `INSERT INTO bookings (client_id, service_type, date, time_slot, otp)
   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
  [clientId, service_type, date, time_slot, otp]
);
    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (err) {
    console.error("Booking error:", err.message);
    res.status(500).json({ message: "Booking failed", error: err.message });
  }
};



// GET /api/client/bookings?status=pending
exports.getClientBookings = async (req, res) => {
  const clientId = req.user.id;
  const { status } = req.query;

  let query = `SELECT * FROM bookings WHERE client_id = $1`;
  let values = [clientId];

  if (status) {
    query += ` AND status = $2`;
    values.push(status);
  }

  query += ` ORDER BY created_at DESC`;

  try {
    const result = await pool.query(query, values);
    res.status(200).json({ bookings: result.rows });
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings", error: err.message });
  }
};


// DELETE /api/client/bookings/:id
exports.cancelBooking = async (req, res) => {
  const clientId = req.user.id;
  const bookingId = req.params.id;

  try {
    const check = await pool.query("SELECT * FROM bookings WHERE id = $1 AND client_id = $2", [
      bookingId,
      clientId,
    ]);
    if (check.rows.length === 0) {
      return res.status(403).json({ message: "Unauthorized or booking not found" });
    }

    // ✅ Change this line
    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND client_id = $2",
      [bookingId, clientId]
    );

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking", error: err.message });
  }
};

