const mongoose = require("mongoose");
const Venue = require("../models/venue.model");

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers

    const toRadians = (degree) => {
        return degree * (Math.PI / 180);
    };

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}


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

function arrayFilter(value) {
    if (!value) return null;

    if (Array.isArray(value)) {
        return value;
    }

    return value.split(",").map(item => item.trim());
}
async function getVenues(req, res) {
    try {
        const {
            city,
            area,
            state,
            location,
            sport,
            owner,
            page = 1,
            limit = 20
        } = req.query;

        const filter = {};

        const cities = arrayFilter(city);
        const areas = arrayFilter(area);
        const states = arrayFilter(state);
        const locations = arrayFilter(location);

        if (cities) {
            filter.city = {
                $in: cities.map(city => new RegExp(`^${city}$`, "i"))
            };
        }

        if (areas) {
            filter.area = {
                $in: areas.map(area => new RegExp(`^${area}$`, "i"))
            };
        }

        if (states) {
            filter.state = {
                $in: states.map(state => new RegExp(`^${state}$`, "i"))
            };
        }

        if (locations) {
            filter.location = {
                $in: locations.map(location => new RegExp(`^${location}$`, "i"))
            };
        }
        if (sport) {
            if (!mongoose.Types.ObjectId.isValid(sport)) {
                return res.status(400).json({
                    message: "Invalid sport id"
                });
            }

            filter.venue_sports = sport;
        }
        if (owner === "me") {
            if (!req.user || req.user.role !== "owner") {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            filter.box_owner_id = req.user.id;

        } else {
            filter.status = "active";
        }
        const pageNumber = Math.max(
            Number(page) || 1,
            1
        );

        const limitNumber = Math.min(
            Math.max(Number(limit) || 20, 1),
            100
        );

        const skip = (pageNumber - 1) * limitNumber;

        const venues = await Venue.find(filter)
            .skip(skip)
            .limit(limitNumber)
            .sort({ created_at: -1 });

        if (venues.length === 0) {
            return res.status(200).json({
                message: "No venues available in the selected area.",
                data: []
            });
        }

        const total = await Venue.countDocuments(filter);

        return res.status(200).json({
            data: venues,
            page: pageNumber,
            limit: limitNumber,
            total
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
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
async function getNearbyVenues(req, res) {
    try {
        const latitude = Number(req.query.latitude);
        const longitude = Number(req.query.longitude);

        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return res.status(400).json({
                message: "Valid latitude and longitude are required."
            });
        }

        if (
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                message: "Invalid latitude or longitude."
            });
        }

        const venues = await Venue.find({
            status: "active",
            latitude: { $ne: null },
            longitude: { $ne: null }
        });

        const nearbyVenues = venues
            .map((venue) => {
                const distance = calculateDistance(
                    latitude,
                    longitude,
                    venue.latitude,
                    venue.longitude
                );

                return {
                    ...venue.toObject(),
                    distance_km: Number(distance.toFixed(2))
                };
            })

            .sort((a, b) => {
                return a.distance_km - b.distance_km;
            });

        return res.status(200).json({
            user_location: {
                latitude,
                longitude
            },
            total: nearbyVenues.length,
            data: nearbyVenues
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function searchVenues(req, res) {
    try {
        const { filters } = req.body;

        if (!Array.isArray(filters) || filters.length === 0) {
            return res.status(400).json({
                message: "Filters must be a non-empty array"
            });
        }

        const allowedFields = [
            "venue_name",
            "city",
            "area",
            "state",
            "location"
        ];
        
        const query = {
            status: "active"
        };

        for (const filter of filters) {
            const { field, value } = filter;

            if (!allowedFields.includes(field)) {
                return res.status(400).json({
                    message: `Invalid search field: ${field}`
                });
            }

            if (!value) {
                return res.status(400).json({
                    message: `Value required for ${field}`
                });
            }

            query[field] = value;
        }

        const venues = await Venue.find(query);

        if (venues.length === 0) {
            return res.status(200).json({
                message: "No sports/venues available for the selected filters.",
                data: []
            });
        }

        return res.status(200).json({
            total: venues.length,
            data: venues
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
    deleteVenue,
    getNearbyVenues,
    searchVenues
};