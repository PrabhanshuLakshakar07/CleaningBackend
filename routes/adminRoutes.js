const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");

router.get("/unassigned-bookings", verifyToken, checkRole("admin"), adminController.getUnassignedBookings);
router.patch("/bookings/:id/assign", verifyToken, checkRole("admin"), adminController.assignCleaner);

router.get("/analytics", verifyToken, checkRole("admin"), adminController.getAnalytics);



module.exports = router;
