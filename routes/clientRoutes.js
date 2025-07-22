const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/clientController");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");
const clientController = require("../controllers/clientController");


// Create a new booking
router.post("/bookings", verifyToken, bookingController.createBooking);


// Get all bookings for the authenticated client
router.get("/bookings", verifyToken, checkRole("client"), clientController.getMyBookings);
router.delete("/bookings/:id", verifyToken, checkRole("client"), clientController.cancelBooking);

module.exports = router;
