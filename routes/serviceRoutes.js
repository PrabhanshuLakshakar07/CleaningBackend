const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const upload = require("../middlewares/upload");
const { verifyToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/roleCheck");

// Admin add service
router.post(
  "/create",
  verifyToken,
  checkRole("admin"),
  upload.single("image"),
  serviceController.createService
);

// Client view services
router.get("/", serviceController.getServices);

module.exports = router;
