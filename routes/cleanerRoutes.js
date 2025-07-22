const express = require("express");
const router = express.Router();
const cleanerController = require("../controllers/cleanerController");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");

router.get("/jobs", verifyToken, checkRole("cleaner"), cleanerController.getAvailableJobs);
router.post("/jobs/:id/accept", verifyToken, checkRole("cleaner"), cleanerController.acceptJob);

module.exports = router;
