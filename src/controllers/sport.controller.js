const mongoose = require("mongoose");
const Sport = require("../models/sport.model");
async function createSport(req, res) {
    
    try {
        const {
            sport_name,
            sport_icon
        } = req.body;
        const sport = await Sport.create({
            sport_name,
            sport_icon
        });
        return res.status(201).json({ message: `${sport_name} created successfully`,
            data:sport
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Sport already exists"
            });
        }
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
const Fuse = require("fuse.js");


async function getSports(req, res) {

    try {

        const { sport_name, status, sort, page, limit } = req.query;
        const filter = {
            status: "active"
        };

        if (req.query.include_disabled === "true") {
            delete filter.status;
        } else if (status) {
            filter.status = status;
        }

        if (sport_name) {
            const escapedName = sport_name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            filter.sport_name = {
                $regex: escapedName,
                $options: "i"
            };
        }

        const allowedSortFields = [
            "sport_name",
            "createdAt",
            "status"
        ];

        let sortOption = {
            createdAt: -1
        };

        if (sort) {
            let field = sort;
            let order = 1;
            if (sort.startsWith("-")) {
                field = sort.substring(1);
                order = -1;
            }

            if (!allowedSortFields.includes(field)) {
                return res.status(400).json({
                    message: "Invalid sort field"
                });
            }
            sortOption = {};
            sortOption[field] = order;
        }

        // Pagination
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
        const skip = (pageNumber - 1) * limitNumber;

        const [sports, total] = await Promise.all([
            Sport.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNumber),

            Sport.countDocuments(filter)
        ]);

        return res.status(200).json({
            message: "Sports fetched successfully",
            data: sports,
            pagination: {
                page: pageNumber,
                limit: limitNumber,
                total,
                total_pages: Math.ceil(total / limitNumber)
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
async function patchSport(req, res) {
    try {
        const { id } = req.params;
        const { sport_name, sport_icon } = req.body;
        const sport = await Sport.findById(id);
        if (!sport) {
            return res.status(404).json({
                message: "Sport not found"
            });
        }
        // Prevent duplicate sportss
        if (sport_name) {
            const existingSport = await Sport.findOne({ sport_name });
            if (existingSport && existingSport._id.toString() !== id) {
                return res.status(409).json({
                    message: "Sport already exists"
                });
            }
            sport.sport_name = sport_name;
        }

        if (sport_icon) {
            sport.sport_icon = sport_icon;
        }
        await sport.save();
        return res.status(200).json({
            message: "Sport updated successfully",
            data: sport
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function putSport(req, res) {
    try {
        const { id } = req.params;
        const { sport_name, sport_icon } = req.body;
        // PUT requires all fields
        if (!sport_name || sport_icon === undefined) {
            return res.status(400).json({
                message: "sport_name and sport_icon are required"
            });
        }

        const sport = await Sport.findById(id);

        if (!sport) {
            return res.status(404).json({
                message: "Sport not found"
            });
        }
        // Prevent duplicate names
        const existingSport = await Sport.findOne({ sport_name });
        if (existingSport && existingSport._id.toString() !== id) {
            return res.status(409).json({
                message: "Sport already exists"
            });
        }
        sport.sport_name = sport_name;
        sport.sport_icon = sport_icon;

        await sport.save();
        return res.status(200).json({
            message: "Sport replaced successfully",
            data: sport
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function deleteSport(req, res) {

    try {
        const { id } = req.params;
        const sport = await Sport.findById(id);

        if (!sport) {
            return res.status(404).json({
                message: "Sport not found"
            });
        }
        sport.status = "disabled";
        await sport.save();
        return res.status(200).json({
            message: "Sport disabled successfully",
            data: sport
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const bulkCreateSports = async (req, res) => {
    try {

        const { sports } = req.body;

        if (!sports) {
            return res.status(400).json({
                message: "Sports array is required"
            });
        }

        if (!Array.isArray(sports)) {
            return res.status(400).json({
                message: "Sports must be an array"
            });
        }

        if (sports.length === 0) {
            return res.status(400).json({
                message: "Sports array cannot be empty"
            });
        }

        if (sports.length > 100) {
            return res.status(400).json({
                message: "Maximum 100 sports allowed"
            });
        }

        for (let i = 0; i < sports.length; i++) {

            if (!sports[i].sport_name) {
                return res.status(400).json({
                    message: `sport_name is missing at index ${i}`
                });
            }

        }

        const createdSports = await Sport.insertMany(sports);

        return res.status(201).json({
            message: "Sports created successfully",
            sports: createdSports
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
};

const bulkUpdateStatus = async (req, res) => {

    try {

        const { ids, status } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: "Ids array is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                message: "Status is required"
            });
        }

        for (let i = 0; i < ids.length; i++) {

            if (!mongoose.isValidObjectId(ids[i])) {

                return res.status(400).json({
                    message: `Invalid id at index ${i}`
                });

            }

        }

        const result = await Sport.updateMany(

            {
                _id: { $in: ids }
            },

            {
                $set: { status }
            }

        );

        return res.status(200).json({

            message: "Sports updated successfully",

            matchedCount: result.matchedCount,

            modifiedCount: result.modifiedCount

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

};

module.exports = {
        createSport,
        getSports,
        putSport,
        patchSport,
        deleteSport,
        bulkCreateSports,
        bulkUpdateStatus
    };