const express = require("express");

const {
    sendOtp,
    verifyOtp
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/customer/send-otp", sendOtp);

router.post("/customer/verify-otp", verifyOtp);

module.exports = router;