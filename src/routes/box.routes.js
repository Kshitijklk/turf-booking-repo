const express = require("express");
const router = express.Router({ mergeParams: true });

const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");

const {
    createBox,
    getBoxes,
    getBoxById,
    updateBox,
    deleteBox
} = require("../controllers/box.controller");

router.post(
    "/",
    requireAuth,
    requireRole("owner"),
    createBox
);

router.get("/", getBoxes);

router.get("/:boxId", getBoxById);

router.patch(
    "/:boxId",
    requireAuth,
    requireRole("owner"),
    updateBox
);

router.delete(
    "/:boxId",
    requireAuth,
    requireRole("owner"),
    deleteBox
);

module.exports = router;