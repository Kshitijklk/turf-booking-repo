const express = require("express");

const {
    createSport,
    getSports,
    searchSportsBasic,
    updateSport,
    deleteSport,
    deleteAllSports
} = require("../controllers/sport.controller");

const router = express.Router();

router.post("/", createSport);
router.get("/", getSports);
router.put("/:id", updateSport);
router.delete("/", deleteAllSports);
router.delete("/:id", deleteSport);
router.get("/basic-search", searchSportsBasic);

module.exports = router;