const express = require("express");

const {
    sendOtp,
    verifyOtp,
    getCustomerById
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/customer/send-otp", sendOtp);

router.post("/customer/verify-otp", verifyOtp);

router.get("/customer/:id", getCustomerById);

module.exports = router;