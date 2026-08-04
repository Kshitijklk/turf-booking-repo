const express = require("express");

const router = express.Router({ mergeParams: true });

const {
    createBox,
    getBoxes,
    getBoxById,
    updateBox,
    deleteBox
} = require("../controllers/box.controller");

router.post("/", createBox);

router.get("/", getBoxes);

router.get("/:boxId", getBoxById);

router.patch("/:boxId", updateBox);

router.delete("/:boxId", deleteBox);

module.exports = router;