// Clean and fixed version:
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");

// Use same name in routes
router.post("/bookings", verifyToken, clientController.createBooking);
router.get("/bookings", verifyToken, clientController.getClientBookings);
router.delete("/bookings/:id", verifyToken, checkRole("client"), clientController.cancelBooking);

module.exports = router;
