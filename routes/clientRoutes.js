const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");
const clientController = require("../controllers/clientController");


// Create a new booking
router.post("/bookings", verifyToken, bookingController.createBooking);


// GET /api/client/bookings?status=pending
router.get('/bookings', verifyToken, clientController.getClientBookings);
router.delete("/bookings/:id", verifyToken, checkRole("client"), clientController.cancelBooking);

module.exports = router;
