const express = require("express");

const {
    createSport,
    getSports
} = require("../controllers/sport.controller");

const router = express.Router();

router.post("/", createSport);

router.get("/", getSports);

module.exports = router;