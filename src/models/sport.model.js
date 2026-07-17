const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
    sport_name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    sport_icon: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["active", "disabled"],
        default: "active"
    }
});

module.exports = mongoose.model("Sport", sportSchema);