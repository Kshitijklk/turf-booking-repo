const express = require("express");

const {
    sendOtp,
    verifyOtp,
    getCustomerById,
    getCustomers,
    updateCustomer
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/customer/send-otp", sendOtp);

router.post("/customer/verify-otp", verifyOtp);

router.get("/customer/:id", getCustomerById);

router.get("/customers", getCustomers);

router.patch("/customer/:id", updateCustomer);

module.exports = router;