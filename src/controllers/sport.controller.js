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

        const { sport_name } = req.query;

        const sports = await Sport.find();

        if (sport_name) {

            const fuse = new Fuse(sports, {
                keys: ["sport_name"],
                threshold: 0.4
            });

            const result = fuse.search(sport_name);

            const filteredSports = result.map(result => result.item);

            return res.status(200).json({
                message: "Sports found successfully",
                data: filteredSports
            });

        }

        return res.status(200).json({
            message: "Sports fetched successfully",
            data: sports
        });

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}
async function updateSport(req, res) {
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

async function deleteAllSports(req, res) {
    try {
        const result = await Sport.deleteMany({});
        return res.status(200).json({
            message: "All sports deleted successfully",
            deletedCount: result.deletedCount
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

        const sport = await Sport.findByIdAndDelete(id);

        if (!sport) {
            return res.status(404).json({
                message: "Sport not found"
            });
        }

        return res.status(200).json({
            message: "Sport deleted successfully",
            data: sport
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

async function searchSportsBasic(req, res) {

    try {

        const { sport_name } = req.query;

        const sports = await Sport.find();

        const filteredSports = [];

        for (let i = 0; i < sports.length; i++) {

            if (sports[i].sport_name.includes(sport_name)) {
                filteredSports.push(sports[i]);
            }

        }

        return res.status(200).json({
            message: "Sports found successfully",
            data: filteredSports
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}
module.exports = {
    createSport,
    getSports,
    updateSport,
    deleteAllSports,
    searchSportsBasic,
    deleteSport
};