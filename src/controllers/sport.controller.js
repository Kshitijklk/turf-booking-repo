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

        return res.status(201).json({
            sport
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

async function getSports(req, res) {

    try {

        const sports = await Sport.find();
        return res.status(200).json(sports);


    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal Server Error"
        });

    }

}


module.exports = {
    createSport,
    getSports
};