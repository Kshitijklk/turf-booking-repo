const mongoose = require("mongoose");
const Venue = require("../models/venue.model");


async function createVenue(req, res) {
    try {
        const {
            venue_name,
            about_venue,
            venue_timing,
            venue_sports,
            location,
            area,
            city,
            state,
            latitude,
            longitude,
            images
        } = req.body;

        if (!venue_name) {
            return res.status(400).json({
                message: "Venue name is required."
            });
        }

        if (images && images.length > 5) {
            return res.status(400).json({
                message: "A venue can have a maximum of 5 images."
            });
        }

        const venue = await Venue.create({
            box_owner_id: req.user.id,

            venue_name,
            about_venue,
            venue_timing,
            venue_sports,
            location,
            area,
            city,
            state,
            latitude,
            longitude,
            images
        });

        return res.status(201).json({
            message: "Venue created successfully.",
            venue
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function getVenueById(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid venue id."
            });
        }

        const venue = await Venue.findOne({
            _id: id,
            status: "active"
        });

        if (!venue) {
            return res.status(404).json({
                message: "Venue not found."
            });
        }

        return res.status(200).json({
            venue
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function getVenues(req, res) {
    try {
        const {
            city,
            sport,
            owner
        } = req.query;

        const page = Math.max(Number(req.query.page) || 1, 1);

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 20, 1),
            100
        );

        const skip = (page - 1) * limit;
        const filter = {};

        if (owner === "me") {
            if (!req.user || req.user.role !== "owner") {
                return res.status(401).json({
                    message: "Authentication required."
                });
            }

            filter.box_owner_id = req.user.id;
        } else {

            filter.status = "active";
        }

        if (city) {
            filter.city = city;
        }

        if (sport) {
            if (!mongoose.Types.ObjectId.isValid(sport)) {
                return res.status(400).json({
                    message: "Invalid sport id."
                });
            }

            filter.venue_sports = sport;
        }

        const venues = await Venue.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ created_at: -1 });

        const total = await Venue.countDocuments(filter);

        return res.status(200).json({
            data: venues,
            page,
            limit,
            total
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
// PATCH /venues/:id
async function updateVenue(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid venue id."
            });
        }

        const venue = await Venue.findById(id);

        if (!venue) {
            return res.status(404).json({
                message: "Venue not found."
            });
        }

        // Owner can only update their own venue
        if (venue.box_owner_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this venue."
            });
        }

        const allowedFields = [
            "venue_name",
            "about_venue",
            "venue_timing",
            "venue_sports",
            "location",
            "area",
            "city",
            "state",
            "latitude",
            "longitude",
            "images"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                venue[field] = req.body[field];
            }
        }

        await venue.save();

        return res.status(200).json({
            message: "Venue updated successfully.",
            venue
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


async function deleteVenue(req, res) {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid venue id."
            });
        }
        const venue = await Venue.findById(id);
        if (!venue) {
            return res.status(404).json({
                message: "Venue not found."
            });
        }

        if (venue.box_owner_id.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to delete this venue."
            });
        }
        venue.status = "disabled";
        await venue.save();
        return res.status(200).json({
            message: "Venue disabled successfully."
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


module.exports = {
    createVenue,
    getVenueById,
    getVenues,
    updateVenue,
    deleteVenue
};