const express = require("express");

const {
    createSport,
        getSports,
        searchSportsBasic,
        putSport,
        patchSport,
        deleteSport
} = require("../controllers/sport.controller");

const router = express.Router();

router.post("/", createSport);
router.get("/", getSports);
router.put("/:id", putSport);
router.patch("/:id", patchSport);
router.delete("/:id", deleteSport);
router.get("/basic-search", searchSportsBasic);

module.exports = router;