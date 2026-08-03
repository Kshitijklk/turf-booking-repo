const express = require("express");

const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const optionalAuth = require("../middlewares/optionalAuth");

const {
    createVenue,
    getVenueById,
    getVenues
} = require("../controllers/venue.controller");

const router = express.Router();

router.post(
    "/venues",
    requireAuth,
    requireRole("owner"),
    createVenue
);

router.get(
    "/venues/:id",
    getVenueById
);

router.get(
    "/venues",
    optionalAuth,
    getVenues
);

module.exports = router;