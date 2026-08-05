const mongoose = require("mongoose");
const Box = require("../models/box.model");
const Venue = require("../models/venue.model");


async function assertOwnsVenue(venueId, userId) {

    if (!mongoose.isValidObjectId(venueId)) {
        return {
            error: "Invalid venue ID",
            status: 400
        };
    }

    const venue = await Venue.findOne({
        _id: venueId,
        status: { $ne: "disabled" }
    });

    if (!venue) {
        return {
            error: "Venue not found",
            status: 404
        };
    }

    if (venue.box_owner_id.toString() !== userId.toString()) {
        return {
            error: "Forbidden",
            status: 403
        };
    }

    return { venue };
}

async function createBox(req, res) {
    try {
        const { venueId } = req.params;
        const { box_name } = req.body;

        const ownership = await assertOwnsVenue(
            venueId,
            req.user.id
        );

        if (ownership.error) {
            return res.status(ownership.status).json({
                message: ownership.error
            });
        }

        if (!box_name) {
            return res.status(400).json({
                message: "Box name is required"
            });
        }

        const box = await Box.create({
            venue_id: venueId,
            box_name
        });

        return res.status(201).json({
            message: "Box created successfully",
            data: box
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function updateBox(req, res) {
    try {
        const { venueId, boxId } = req.params;
        const { box_name } = req.body;

        const ownership = await assertOwnsVenue(
            venueId,
            req.user.id
        );

        if (ownership.error) {
            return res.status(ownership.status).json({
                message: ownership.error
            });
        }

        if (!mongoose.isValidObjectId(boxId)) {
            return res.status(400).json({
                message: "Invalid box ID"
            });
        }

        const box = await Box.findOne({
            _id: boxId,
            venue_id: venueId
        });

        if (!box) {
            return res.status(404).json({
                message: "Box not found"
            });
        }

        if (box_name) {
            box.box_name = box_name;
        }

        await box.save();

        return res.status(200).json({
            message: "Box updated successfully",
            data: box
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function deleteBox(req, res) {
    try {
        const { venueId, boxId } = req.params;

        const ownership = await assertOwnsVenue(
            venueId,
            req.user.id
        );

        if (ownership.error) {
            return res.status(ownership.status).json({
                message: ownership.error
            });
        }

        if (!mongoose.isValidObjectId(boxId)) {
            return res.status(400).json({
                message: "Invalid box ID"
            });
        }

        const box = await Box.findOne({
            _id: boxId,
            venue_id: venueId
        });

        if (!box) {
            return res.status(404).json({
                message: "Box not found"
            });
        }

        box.status = "disabled";

        await box.save();

        return res.status(200).json({
            message: "Box disabled successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function getBoxes(req, res) {
    return res.json({
        message: "Part 4"
    });
}

async function getBoxById(req, res) {
    return res.json({
        message: "Part 4"
    });
}


module.exports = {
    createBox,
    getBoxes,
    getBoxById,
    updateBox,
    deleteBox
};