const express = require("express");
const requireAuth = require("../middlewares/requireAuth");

const {
    sendOtp,
    verifyOtp,
    refreshToken,
    logout,
    getCustomerById,
    getCustomers,
    updateCustomer,
    getCustomerSummary
} = require("../controllers/auth.controller");

const router = express.Router();


router.post("/customer/send-otp", sendOtp);
router.post("/customer/verify-otp", verifyOtp);
router.post("/customer/refresh", refreshToken);
router.post("/customer/logout", logout);
router.get("/customer/:id/summary", requireAuth, getCustomerSummary);
router.get("/customer/:id", requireAuth, getCustomerById);
router.get("/customers", requireAuth, getCustomers);
router.patch("/customer/:id", requireAuth, updateCustomer);
module.exports = router;