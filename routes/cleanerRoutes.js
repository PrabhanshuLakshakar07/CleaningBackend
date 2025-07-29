const express = require("express");
const router = express.Router();
const cleanerController = require("../controllers/cleanerController");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");

router.get("/jobs", verifyToken, checkRole("cleaner"), cleanerController.getAvailableJobs);
router.post("/jobs/:id/accept", verifyToken, checkRole("cleaner"), cleanerController.acceptJob);

// Only for logged-in cleaners
router.get("/bookings", verifyToken, checkRole("cleaner"), cleanerController.getAssignedBookings);

router.put("/bookings/:id/status", verifyToken, checkRole("cleaner"), cleanerController.updateBookingStatus);


module.exports = router;
