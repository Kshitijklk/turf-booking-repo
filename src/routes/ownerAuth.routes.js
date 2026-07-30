const express = require("express");
const router = express.Router();

const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");

const {
    registerOwner,
    loginOwner,
    getOwnerProfile
} = require("../controllers/ownerAuth.controller");

router.get(
    "/profile",
    requireAuth,
    requireRole("owner"),
    getOwnerProfile
);

router.post(
    "/register",
    registerOwner
);

router.post(
    "/login",
    loginOwner
);

module.exports = router;